# Security Policy — JACKED

## Overview

JACKED is a client-side progressive web application with no backend infrastructure. This document describes the deliberate security decisions made during design, the threat model, and the known limitations of a static PWA.

---

## Threat Model

| Threat | Likelihood | Impact | Mitigation |
|--------|-----------|--------|-----------|
| Data breach via server compromise | **None** | N/A | No server exists |
| Credential theft | **None** | N/A | No authentication layer |
| Man-in-the-middle attack on data in transit | **None** | N/A | No data transmitted |
| XSS via stored/imported data (exercise names, backup files, Exercise DB feed) | Low | Medium | Output encoding (`esc()`) on every render site; data sanitised on read from storage; CSP blocks external scripts and exfiltration |
| Malicious backup file | Low | Medium | 5 MB size cap, app-key allowlist (`jacked_*` / `bloc_*`), all restored values re-validated on read |
| Unauthorised access to workout data | Low | Low | Data is on-device; attacker needs physical access to unlocked device |
| Supply chain attack via CDN / third-party feed | Low | Medium | Google Fonts (non-executable CSS) and the optional free-exercise-db JSON import; imported entries are type-checked, length-capped and escaped |
| Repo hijack / code tampering | Low | Medium | GitHub account 2FA recommended; see below |

---

## Deliberate Design Decisions

### No Backend
JACKED has no server, no API, and no database. This eliminates the largest category of web application vulnerabilities: server-side injection, authentication bypass, privilege escalation, and data exfiltration via backend compromise.

This was a deliberate choice, not an oversight.

### No Authentication
There are no user accounts, passwords, or sessions. Authentication would introduce credential management, session token risks, and account recovery complexity — none of which is warranted for a single-user personal fitness tracker.

Access control is physical: your device, your browser, your data.

### Local-Only Data Storage
All user data (workout logs, program configuration, exercise history, progression data) is stored exclusively in the browser's `localStorage` on the user's own device.

- Data is **never transmitted** to any server
- Data is **never shared** with any third party
- Data is **never accessible** to other origins (same-origin policy enforced by the browser)
- Data persists only on the device it was created on

The consequence: if you clear your browser data or switch devices, your data does not follow. This is a deliberate trade-off favouring privacy over convenience.

### No Sensitive Data
The application does not collect, process, or store:
- Names, email addresses, or identity information
- Payment information
- Health data beyond self-reported workout metrics
- Location data
- Device identifiers

Workout logs (sets, reps, weight, RIR) are fitness performance data with no regulatory classification in Australia.

### HTTPS Enforced
GitHub Pages enforces HTTPS with a valid TLS certificate for all `github.io` subdomains. The "Enforce HTTPS" flag is enabled in repository Pages settings. All traffic between the user's browser and the CDN is encrypted in transit.

### Content Security
External resources loaded at runtime:
- Google Fonts stylesheet and font files, over HTTPS from `fonts.googleapis.com` and `fonts.gstatic.com`
- The optional **Import Exercise DB** button fetches a JSON file from `raw.githubusercontent.com` (yuhonas/free-exercise-db). It is only fetched when the user taps the button, is treated as untrusted data (shape-checked, IDs restricted to `[A-Za-z0-9_-]`, strings length-capped) and is never executed.

No JavaScript is loaded from external sources.

### XSS Defences (OWASP A03 Injection)
- **Output encoding:** every stored or imported string rendered through `innerHTML` (exercise names, notes, muscle, equipment, session names, logged weights/reps, dates) passes through `esc()`, which HTML-encodes `& < > " ' \``.
- **Input validation on read:** workout history, bodyweight, program, workout log, feedback, awards and the in-progress session are validated/cleaned every time they are read from `localStorage` (dates must be `YYYY-MM-DD`, weights/reps must be numeric, markup characters stripped, `__proto__`/`constructor` keys dropped).
- **Backup restore:** capped at 5 MB, must be a JSON object tagged `app: "JACKED"`, and only keys matching `^(jacked|bloc)_…$` are written.
- No `eval`, `new Function`, `document.write` or string-based timers.

No advertising networks, tracking pixels, analytics scripts, or third-party SDKs are present.

---

## Known Limitations

### localStorage Is Not Encrypted
Browser `localStorage` is stored in plaintext on the device filesystem. On an unlocked device with physical access, a determined attacker could read workout data via browser developer tools or filesystem access.

**Mitigation:** This risk is equivalent to someone reading your paper training diary. For a personal fitness app, this is an accepted risk.

### Content Security Policy via `<meta>` Only
GitHub Pages does not support custom HTTP response headers, so the CSP is delivered as a `<meta http-equiv>` tag. It restricts scripts to same-origin, styles/fonts to Google Fonts, network requests (`connect-src`) to same-origin and `raw.githubusercontent.com`, and blocks plugins (`object-src 'none'`), `<base>` hijacking and form submission.

Limitations: the single-file design uses inline scripts and inline event handlers, so `script-src` must allow `'unsafe-inline'`; output encoding is therefore the primary XSS control and CSP is defence in depth. `frame-ancestors` (clickjacking protection) cannot be set from a meta tag; the practical risk is low as the app has no account actions or sensitive state-changing operations to trick a user into.

### Public Source Code
The repository is public. Anyone can read the application source code.

There are no secrets in the source code — no API keys, no credentials, no tokens, no internal infrastructure details. The source code is a workout tracker.

### No Subresource Integrity (SRI) on Fonts
Google Fonts does not support Subresource Integrity hashes. If the Google Fonts CDN were compromised (an extremely low probability, high-impact event), a malicious stylesheet could theoretically be served. JavaScript is not loaded from Google Fonts, limiting the practical attack surface to visual degradation.

---

## Recommendations for Users

1. **Enable 2FA on your GitHub account** to prevent unauthorised code modifications
2. **Do not store sensitive personal information** in exercise names or notes fields
3. **Back up your data periodically** — export `localStorage` via browser developer tools if you want a backup, as clearing browser data will erase your history

---

## Responsible Disclosure

This is a personal open-source project. If you identify a genuine security issue:

1. Open a GitHub Issue describing the vulnerability
2. Do not publicly disclose exploits before a fix is in place

There is no bug bounty program.

---

## Security Contact

Raise an issue at: `https://github.com/scuznips/Jacked/issues`

---

*Last reviewed: September 2026 (OWASP Top 10 pass: XSS/output encoding, input validation, CSP, third-party data)*
*Reviewed by: scuznips*

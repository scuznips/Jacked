# JACKED — Hypertrophy Training System

> A science-based hypertrophy tracker built as a progressive web app. No accounts, no subscriptions, no data leaving your device.

![License](https://img.shields.io/badge/license-CC%20BY--NC%204.0-blue)
![Platform](https://img.shields.io/badge/platform-Mobile%20Web%20%2F%20PWA-brightgreen)
![Data](https://img.shields.io/badge/data-Local%20only-orange)

---

## What It Does

JACKED is a mobile-first workout tracking app built around the scientific principles of hypertrophy (muscle growth). It helps you:

- Build a personalised training program based on your available days
- Log workouts with set-by-set weight and rep tracking
- Automatically progress load using double progression
- Track volume, sets, and RIR (Reps in Reserve) over time
- View real analytics drawn from your actual logged data

Everything runs in the browser. All data is stored in `localStorage` on your device.

---

## The Science Behind It

### Hypertrophy Fundamentals

Skeletal muscle hypertrophy — the increase in muscle fibre cross-sectional area — is driven by mechanical tension, metabolic stress, and muscle damage (Schoenfeld, 2010). Of these, mechanical tension close to failure is considered the primary driver of myofibrillar hypertrophy (Wackerhage et al., 2019).

JACKED is built around the following evidence-based principles:

---

### 1. Volume Landmarks (RP Model)

The app uses the Renaissance Periodization (RP) volume landmark framework developed by Dr. Mike Israetel:

| Landmark | Definition | Typical Range |
|----------|-----------|---------------|
| **MV** — Maintenance Volume | Minimum sets to maintain current muscle | ~6 sets/week/muscle |
| **MEV** — Minimum Effective Volume | Starting point for hypertrophic stimulus | 10–12 sets/week/muscle |
| **MAV** — Maximum Adaptive Volume | Optimal growth zone; increases week over week | 12–20 sets/week/muscle |
| **MRV** — Maximum Recoverable Volume | Upper limit before recovery is compromised | 18–25 sets/week/muscle |

Programs in JACKED start at MEV and are designed to progress toward MAV across a 4-week mesocycle. A 2024 systematic review and meta-analysis (Pelland et al.) confirmed higher weekly set volumes enhance hypertrophy in a dose-response relationship, with benefits observed up to ~20 direct sets per muscle per week.

---

### 2. Training Frequency

Current evidence indicates that training a muscle group **twice per week** produces superior hypertrophy compared to once per week when volume is equated, primarily due to more frequent muscle protein synthesis (MPS) spikes (Schoenfeld et al., 2016; Ralston et al., 2017).

JACKED's split recommendations reflect this:

| Days Available | Recommended Split | Frequency per Muscle |
|---------------|------------------|---------------------|
| 2–3 days | Full Body | 2–3x |
| 4 days | Upper / Lower | 2x |
| 5 days | Bro Split | 1x (high volume/session) |
| 6 days | Push / Pull / Legs | 2x |

The PPL and Upper/Lower splits are prioritised for intermediate-to-advanced trainees due to their 2x weekly frequency per muscle group.

---

### 3. Rep Ranges

JACKED uses a **6–15 rep range** for all exercises. This is consistent with current meta-analytic evidence showing hypertrophy occurs across a broad rep range (5–35 reps) provided sets are taken close to failure (Schoenfeld et al., 2017; Morton et al., 2016).

The 6–15 window balances:
- **Mechanical tension** (heavier loads, lower reps)
- **Metabolic stress** (higher reps, more time under tension)
- **Joint safety** (avoids the very heavy loads of pure strength work)

Different rep ranges are assigned based on exercise type: compound movements lean toward 6–10, isolation exercises toward 10–15.

---

### 4. Proximity to Failure — RIR Tracking

Proximity to failure is one of the strongest determinants of hypertrophic stimulus (Baz-Valle et al., 2022). JACKED tracks **Reps in Reserve (RIR)** — the number of reps remaining before technical failure.

The mesocycle RIR structure follows RP guidelines:

| Week | Target RIR | Description |
|------|-----------|-------------|
| Week 1 | 3–4 RIR | Acclimatisation; high volume tolerance |
| Week 2 | 2–3 RIR | Stimulus increasing |
| Week 3 | 1–2 RIR | High stimulus phase |
| Week 4 | 0–1 RIR | Peak effort; approaching failure |

After Week 4, a deload is recommended to allow supercompensation.

---

### 5. Double Progression

JACKED uses **double progression** as its primary overload mechanism — the most conservative and evidence-supported form of progressive overload for hypertrophy:

1. **Phase 1 — Rep Progression:** Each session, aim to add 1 rep per set (within the 6–15 range)
2. **Phase 2 — Load Progression:** Once all sets hit the top of the rep range (15 reps), increase weight by **+2.5kg** and reset reps to the bottom (6 reps)

This approach ensures progressive overload — the fundamental driver of long-term hypertrophy (American College of Sports Medicine, 2009) — without aggressive weight jumps that compromise form or joint health.

The app reads your previous session's data and automatically calculates the suggested weight and reps for each set, displayed as placeholder text in the input fields.

---

### 6. Exercise Selection Principles

Exercises in JACKED are selected based on:

- **Stretch-mediated hypertrophy:** Emerging evidence (Maeo et al., 2021; Pedrosa et al., 2022) suggests exercises that load the muscle in a lengthened position (e.g. Romanian deadlift, incline curl, overhead tricep extension) produce superior hypertrophy per set
- **Multiplanar stimulus:** Each muscle is trained across multiple angles across the week to maximise fibre recruitment
- **Practical equipment:** The library is built around Smith machine, barbell, dumbbell, cable, and bodyweight — common gym equipment

---

### 7. Exercise Volume Distribution (Bro Split example)

| Muscle Group | Sets/Week | MEV | MRV |
|-------------|-----------|-----|-----|
| Chest | 14–16 | 10 | 22 |
| Back | 16 | 10 | 25 |
| Shoulders | 15 | 8 | 20 |
| Triceps | 12–15 | 6 | 18 |
| Biceps | 9–12 | 6 | 20 |
| Quads | 12–18 | 8 | 20 |
| Hamstrings | 10–12 | 6 | 16 |
| Glutes | 10–14 | 8 | 20 |
| Calves | 12–16 | 8 | 20 |

---

## Technical Architecture

| Layer | Implementation |
|-------|---------------|
| **Frontend** | Vanilla HTML5, CSS3, JavaScript (ES6+) |
| **Storage** | Browser `localStorage` — no backend, no database |
| **Hosting** | GitHub Pages (static) |
| **Install** | PWA manifest — installable via browser "Add to Home Screen" |
| **Fonts** | Bebas Neue, DM Sans, DM Mono (Google Fonts) |
| **Network** | Zero runtime network requests after initial load |

### Data Model (localStorage)

```
jacked_program      → Active program (split, days, session assignments, start date)
jacked_log          → Workout log { 'YYYY-MM-DD': { sets, volume, rir, date } }
jacked_ex           → Custom exercises added by user
bloc_hist_{exId}    → Per-exercise history for progression calculations (last 20 sessions)
```

---

## Installation

### As a PWA (recommended)

1. Open `https://scuznips.github.io/Jacked/workout-app.html` in Safari (iOS) or Chrome (Android)
2. iOS: tap Share → **Add to Home Screen**
3. Android: tap ⋮ → **Install app**

### Local

Download `workout-app.html`, `manifest.json`, and `icon.svg` into the same folder. Open `workout-app.html` in any modern browser.

---

## References

- American College of Sports Medicine. (2009). Progression Models in Resistance Training for Healthy Adults. *Medicine & Science in Sports & Exercise*, 41(3), 687–708.
- Baz-Valle, E., et al. (2022). The effects of exercise variation in muscle thickness, maximal strength and motivation in resistance trained men. *PLOS ONE*, 17(2).
- Maeo, S., et al. (2021). Seated versus standing calf-raise exercise and the risk of Achilles tendinopathy. *International Journal of Sports Physiology and Performance*.
- Morton, R.W., et al. (2016). Neither load nor systemic hormones determines resistance training-mediated hypertrophy or strength gains in resistance-trained young men. *Journal of Applied Physiology*, 121(1), 129–138.
- Pelland, J.C., et al. (2024). The Resistance Training Dose-Response: Meta-Regressions Exploring the Effects of Weekly Volume and Frequency on Muscle Hypertrophy and Strength Gain. *SportRxiv*.
- Pedrosa, G.F., et al. (2022). Partial range of motion training elicits favorable improvements in muscular adaptations when carried out at long muscle lengths. *European Journal of Sport Science*, 22(8), 1250–1260.
- Ralston, G.W., et al. (2017). The Effect of Weekly Set Volume on Strength Gain. *Sports Medicine*, 47(12), 2585–2601.
- Schoenfeld, B.J. (2010). The mechanisms of muscle hypertrophy and their application to resistance training. *Journal of Strength and Conditioning Research*, 24(10), 2857–2872.
- Schoenfeld, B.J., et al. (2016). Effects of Resistance Training Frequency on Measures of Muscle Hypertrophy. *Journal of Strength and Conditioning Research*, 30(7), 1858–1864.
- Schoenfeld, B.J., et al. (2017). Strength and Hypertrophy Adaptations Between Low- vs. High-Load Resistance Training. *Journal of Strength and Conditioning Research*, 31(12), 3508–3523.
- Wackerhage, H., et al. (2019). Stimuli and sensors that initiate skeletal muscle hypertrophy following resistance exercise. *Journal of Applied Physiology*, 126(1), 30–43.

---

## License

© 2026 scuznips. Licensed under [Creative Commons Attribution-NonCommercial 4.0 International](https://creativecommons.org/licenses/by-nc/4.0/).

You may share and adapt this work for non-commercial purposes with attribution. Commercial use is not permitted without explicit written permission.

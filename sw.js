const CACHE = 'jacked-v1';
const ASSETS = ['./workout-app.html', './manifest.json', './icon.svg', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS).catch(() => {})));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      const fresh = fetch(e.request).then(res => {
        if (res && res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => cached);
      return cached || fresh;
    })
  );
});

self.addEventListener('periodicsync', e => {
  if (e.tag === 'training-reminder') e.waitUntil(checkAndNotify());
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
      for (const c of cs) { if ('focus' in c) return c.focus(); }
      return clients.openWindow('./workout-app.html');
    })
  );
});

async function checkAndNotify() {
  const db = await openDB();
  const settings = await dbGet(db, 'reminder');
  if (!settings || !settings.enabled) return;

  const today = new Date();
  const todayStr = fmt(today);
  const lastNotified = await dbGet(db, 'last-notified');
  if (lastNotified === todayStr) return;

  const dayNames = ['sun','mon','tue','wed','thu','fri','sat'];
  if (settings.days && settings.days.length && !settings.days.includes(dayNames[today.getDay()])) return;

  const lastWorkout = await dbGet(db, 'last-workout-date');
  if (lastWorkout === todayStr) return;

  if (lastWorkout) {
    const daysSince = Math.floor((today - new Date(lastWorkout + 'T00:00:00')) / 86400000);
    if (daysSince < (settings.gapDays || 2)) return;
  }

  const body = lastWorkout
    ? 'Last session ' + Math.floor((today - new Date(lastWorkout + 'T00:00:00')) / 86400000) + ' days ago. Your next session is ready.'
    : 'No sessions logged yet. Start your first session.';

  await self.registration.showNotification('JACKED', {
    body,
    icon: './icon-192.png',
    badge: './icon-192.png',
    tag: 'training-reminder',
    renotify: false,
    data: { url: './workout-app.html' }
  });

  await dbSet(db, 'last-notified', todayStr);
}

function fmt(d) {
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}

function openDB() {
  return new Promise((res, rej) => {
    const req = indexedDB.open('jacked-settings', 1);
    req.onupgradeneeded = e => e.target.result.createObjectStore('kv', { keyPath: 'k' });
    req.onsuccess = e => res(e.target.result);
    req.onerror = rej;
  });
}

function dbGet(db, key) {
  return new Promise((res, rej) => {
    const req = db.transaction('kv', 'readonly').objectStore('kv').get(key);
    req.onsuccess = () => res(req.result ? req.result.v : null);
    req.onerror = rej;
  });
}

function dbSet(db, key, val) {
  return new Promise((res, rej) => {
    const req = db.transaction('kv', 'readwrite').objectStore('kv').put({ k: key, v: val });
    req.onsuccess = res;
    req.onerror = rej;
  });
}

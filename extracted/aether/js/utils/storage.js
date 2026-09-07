// Storage — thin, safe wrapper around localStorage (private browsing / quota safe)

const PREFIX = 'aether:';

function isAvailable() {
  try {
    const t = '__aether_test__';
    localStorage.setItem(t, '1');
    localStorage.removeItem(t);
    return true;
  } catch (e) {
    return false;
  }
}

const available = isAvailable();
const memoryFallback = new Map();

export const storage = {
  get(key, fallback = null) {
    try {
      if (!available) return memoryFallback.has(key) ? memoryFallback.get(key) : fallback;
      const raw = localStorage.getItem(PREFIX + key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  },
  set(key, value) {
    try {
      if (!available) { memoryFallback.set(key, value); return true; }
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  },
  remove(key) {
    try {
      if (!available) { memoryFallback.delete(key); return; }
      localStorage.removeItem(PREFIX + key);
    } catch (e) { /* noop */ }
  }
};

// Performance — decides data-perf="high"|"low" on <html> so CSS/JS can
// scale back blur, particle count, and transition complexity on weaker devices.

function prefersReducedMotion() {
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function looksLowEnd() {
  const cores = navigator.hardwareConcurrency || 4;
  const mem = navigator.deviceMemory || 4; // not available in all browsers, defaults gracefully
  const saveData = navigator.connection && navigator.connection.saveData;
  const smallViewport = Math.min(window.innerWidth, window.innerHeight) < 420;
  return cores <= 4 || mem <= 4 || !!saveData || smallViewport;
}

export const perf = {
  reducedMotion: prefersReducedMotion(),
  tier: looksLowEnd() ? 'low' : 'high',

  init() {
    document.documentElement.dataset.perf = this.tier;
    if (this.reducedMotion) {
      document.documentElement.dataset.reducedMotion = 'true';
    }

    // Live FPS sample during the first couple of seconds — if the device is
    // struggling even before we've added much, drop to the light profile.
    let frames = 0;
    let start = performance.now();
    const sample = (t) => {
      frames++;
      if (t - start < 1500) {
        requestAnimationFrame(sample);
      } else {
        const fps = (frames / (t - start)) * 1000;
        if (fps < 45 && this.tier !== 'low') {
          this.tier = 'low';
          document.documentElement.dataset.perf = 'low';
          window.dispatchEvent(new CustomEvent('aether:perf-downgrade'));
        }
      }
    };
    requestAnimationFrame(sample);

    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener?.('change', (e) => {
      this.reducedMotion = e.matches;
      document.documentElement.dataset.reducedMotion = e.matches ? 'true' : 'false';
    });
  },

  isLow() { return this.tier === 'low'; }
};

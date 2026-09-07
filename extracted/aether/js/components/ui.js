// UI — navbar chrome, mobile nav, search, toasts, and generic modal/drawer helpers.

export function initNavbar() {
  const navbar = document.querySelector('.navbar');
  return {
    setSolid(isSolid) { navbar.classList.toggle('solid', isSolid); },
    setActiveLink(sceneId) {
      document.querySelectorAll('.nav-links a, .mobile-nav-panel a').forEach((a) => {
        a.classList.toggle('active', a.dataset.scene === sceneId);
      });
    }
  };
}

export function initMobileMenu() {
  const btn = document.querySelector('.hamburger');
  const panel = document.querySelector('.mobile-nav-panel');
  if (!btn || !panel) return;

  const close = () => { panel.classList.remove('open'); document.body.classList.remove('no-scroll'); };
  const open = () => { panel.classList.add('open'); document.body.classList.add('no-scroll'); };

  btn.addEventListener('click', () => panel.classList.contains('open') ? close() : open());
  panel.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));

  return { close, open };
}

export function initSearch(dataSource) {
  const flyout = document.querySelector('.search-flyout');
  const input = flyout?.querySelector('input');
  const resultsEl = flyout?.querySelector('.search-results');
  const trigger = document.querySelector('[data-action="toggle-search"]');
  if (!flyout || !input || !resultsEl || !trigger) return;

  const close = () => { flyout.classList.remove('open'); input.value = ''; resultsEl.innerHTML = ''; };
  const open = () => { flyout.classList.add('open'); requestAnimationFrame(() => input.focus()); };

  trigger.addEventListener('click', () => flyout.classList.contains('open') ? close() : open());

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (q.length < 2) { resultsEl.innerHTML = ''; return; }
    const items = dataSource(q);
    resultsEl.innerHTML = items.length
      ? items.map((it) => `
        <div class="search-result-item" data-scene="${it.scene}" data-id="${it.id}">
          <span>${it.label}</span><span style="color:var(--ash)">${it.hint}</span>
        </div>`).join('')
      : `<div class="search-result-item"><span>No matches for &ldquo;${q}&rdquo;</span></div>`;
  });

  resultsEl.addEventListener('click', (e) => {
    const row = e.target.closest('.search-result-item[data-scene]');
    if (!row) return;
    window.dispatchEvent(new CustomEvent('aether:go-scene', { detail: { id: row.dataset.scene } }));
    if (row.dataset.id) window.dispatchEvent(new CustomEvent('aether:open-detail', { detail: { kind: row.dataset.scene, id: row.dataset.id } }));
    close();
  });

  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

  return { close, open };
}

// ---------- Toast ----------
export const toast = {
  show(message, type = 'info') {
    const stack = document.getElementById('toast-stack');
    if (!stack) return;
    const el = document.createElement('div');
    el.className = `toast ${type === 'error' ? 'error' : ''}`;
    el.innerHTML = `<span class="dot"></span><p>${message}</p>`;
    stack.appendChild(el);
    requestAnimationFrame(() => el.classList.add('in'));
    setTimeout(() => {
      el.classList.remove('in');
      setTimeout(() => el.remove(), 300);
    }, 3200);
  }
};

// ---------- Generic overlay (drawer / modal) ----------
export function makeOverlayController(overlayEl, panelEl) {
  function open() {
    overlayEl.classList.add('open');
    panelEl.classList.add('open');
    document.body.classList.add('no-scroll');
  }
  function close() {
    overlayEl.classList.remove('open');
    panelEl.classList.remove('open');
    document.body.classList.remove('no-scroll');
  }
  overlayEl.addEventListener('click', (e) => { if (e.target === overlayEl) close(); });
  panelEl.querySelectorAll('[data-action="close"]').forEach((b) => b.addEventListener('click', close));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && overlayEl.classList.contains('open')) close(); });
  return { open, close, isOpen: () => overlayEl.classList.contains('open') };
}

// ---------- Back to top ----------
export function initBackToTop(onClick) {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  btn.addEventListener('click', onClick);
  return { setVisible(v) { btn.classList.toggle('visible', v); } };
}

// ---------- Card tilt (desktop pointer only) ----------
export function attachTilt(el, strength = 8) {
  if (window.matchMedia('(hover: none)').matches) return;
  el.addEventListener('mousemove', (e) => {
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--ry', `${px * strength}deg`);
    el.style.setProperty('--rx', `${-py * strength}deg`);
  });
  el.addEventListener('mouseleave', () => {
    el.style.setProperty('--ry', '0deg');
    el.style.setProperty('--rx', '0deg');
  });
}

// ---------- Magnetic button (desktop pointer only) ----------
export function attachMagnetic(el, strength = 0.35) {
  if (window.matchMedia('(hover: none)').matches) return;
  el.addEventListener('mousemove', (e) => {
    const r = el.getBoundingClientRect();
    const mx = (e.clientX - r.left - r.width / 2) * strength;
    const my = (e.clientY - r.top - r.height / 2) * strength;
    el.style.transform = `translate(${mx}px, ${my}px)`;
  });
  el.addEventListener('mouseleave', () => { el.style.transform = ''; });
}

// ---------- Reveal-on-visible for scroll reveal / skeleton swap ----------
export function observeReveal(selector, className = 'in', root = null) {
  const els = document.querySelectorAll(selector);
  if (!('IntersectionObserver' in window) || !els.length) {
    els.forEach((el) => el.classList.add(className));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add(className), i * 40);
        io.unobserve(entry.target);
      }
    });
  }, { root, threshold: 0.15 });
  els.forEach((el) => io.observe(el));
}

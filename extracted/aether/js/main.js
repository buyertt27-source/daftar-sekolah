import { perf } from './utils/performance.js';
import { initNavbar, initMobileMenu, initSearch, initBackToTop, makeOverlayController, attachMagnetic } from './components/ui.js';
import { initAmbientBackground, initHeroObject } from './animations/three-background.js';
import { createSceneEngine } from './animations/scene-engine.js';
import { renderPortfolio, workDetailHTML } from './sections/portfolio.js';
import { renderProducts, productDetailHTML, wireProductDetail } from './sections/products.js';
import { initCommerce, addToCart } from './sections/commerce.js';
import { initContactForm } from './sections/contact.js';
import { initAccountPanel } from './sections/account.js';
import { products } from './data/products.js';
import { portfolio } from './data/portfolio.js';

perf.init();

// ---------- Overlays ----------
const cartOverlay = makeOverlayController(document.getElementById('cart-overlay'), document.getElementById('cart-panel'));
const checkoutOverlay = makeOverlayController(document.getElementById('checkout-overlay'), document.getElementById('checkout-panel'));
const accountOverlay = makeOverlayController(document.getElementById('account-overlay'), document.getElementById('account-panel'));
const detailOverlay = makeOverlayController(document.getElementById('detail-overlay'), document.getElementById('detail-panel'));

function isAnyOverlayOpen() {
  const extra = document.querySelector('.mobile-nav-panel.open, .search-flyout.open');
  return !!extra || [cartOverlay, checkoutOverlay, accountOverlay, detailOverlay].some((o) => o.isOpen());
}

// ---------- 3D background ----------
const ambient = initAmbientBackground(perf.isLow());
const heroObject = initHeroObject(perf.isLow());
window.addEventListener('aether:perf-downgrade', () => { ambient?.destroy(); });

// ---------- Scene engine ----------
const scrollHint = document.querySelector('.scroll-hint');
const progressBar = document.getElementById('scroll-progress');

function updateProgress() {
  const idx = sceneEngine.current();
  const total = sceneEngine.total();
  const el = document.querySelectorAll('.scene')[idx];
  const inSceneFrac = el.scrollHeight > el.clientHeight ? el.scrollTop / (el.scrollHeight - el.clientHeight) : 0;
  const frac = (idx + inSceneFrac) / Math.max(1, total - 1);
  if (progressBar) progressBar.style.width = `${Math.min(100, frac * 100)}%`;
}

const sceneEngine = createSceneEngine({
  isOverlayOpen: isAnyOverlayOpen,
  onHeroProgress(frac) {
    heroObject?.setScrollFraction(frac * 0.6);
    ambient?.setScrollFraction(frac * 0.3);
    if (frac > 0.05) scrollHint?.classList.add('hidden');
    else scrollHint?.classList.remove('hidden');
  }
});

document.querySelectorAll('.scene').forEach((el) => el.addEventListener('scroll', () => requestAnimationFrame(updateProgress)));
window.addEventListener('aether:scene-change', (e) => {
  navbar.setSolid(e.detail.index !== 0);
  navbar.setActiveLink(e.detail.id);
  backToTop.setVisible(e.detail.index !== 0);
  if (e.detail.index !== 0) scrollHint?.classList.add('hidden');
  updateProgress();
});

function goToScene(id) { sceneEngine.goToId(id); }
window.addEventListener('aether:go-scene', (e) => goToScene(e.detail.id));

// ---------- Navbar / mobile menu / search ----------
const navbar = initNavbar();
initMobileMenu();
initSearch((q) => {
  const ql = q.toLowerCase();
  const prod = products.filter((p) => p.name.toLowerCase().includes(ql) || p.category.toLowerCase().includes(ql))
    .map((p) => ({ scene: 'products', id: p.id, label: p.name, hint: p.category }));
  const work = portfolio.filter((w) => w.title.toLowerCase().includes(ql) || w.category.toLowerCase().includes(ql))
    .map((w) => ({ scene: 'portfolio', id: w.id, label: w.title, hint: w.category }));
  return [...prod, ...work].slice(0, 8);
});

document.querySelectorAll('[data-scene]').forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    goToScene(link.dataset.scene);
    if (link.dataset.scene === 'contact' && link.dataset.anchor === 'payment') {
      setTimeout(() => document.getElementById('payment-badges-anchor')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 700);
    }
  });
});

const backToTop = initBackToTop(() => goToScene('home'));

document.querySelectorAll('.btn-primary, .icon-btn').forEach((el) => attachMagnetic(el, 0.25));

// ---------- Detail modal (shared: product + portfolio) ----------
function openDetail(kind, id) {
  const content = document.getElementById('detail-content');
  if (kind === 'product') {
    content.innerHTML = productDetailHTML(id);
    wireProductDetail(content, id, {
      onAddToCart: (p, variant, qty) => addToCart(p, variant, qty),
      onBuyNow: () => { detailOverlay.close(); commerce.openCheckout(); }
    });
  } else {
    content.innerHTML = workDetailHTML(id);
  }
  detailOverlay.open();
}
window.addEventListener('aether:open-detail', (e) => openDetail(e.detail.kind === 'products' ? 'product' : 'work', e.detail.id));

// ---------- Sections ----------
renderPortfolio((id) => openDetail('work', id));
renderProducts((id) => openDetail('product', id), (p, variant, qty) => {
  addToCart(p, variant, qty);
});

const commerce = initCommerce({ cartOverlay, checkoutOverlay, goToScene });
initContactForm();
initAccountPanel((id) => { accountOverlay.close(); openDetail('product', id); });

document.getElementById('open-account-btn')?.addEventListener('click', () => {
  window.dispatchEvent(new CustomEvent('aether:open-account'));
  accountOverlay.open();
});

// ---------- Hero load-in (the single orchestrated motion moment) ----------
function playHeroReveal() {
  document.querySelectorAll('.hero .reveal-up').forEach((el, i) => {
    setTimeout(() => el.classList.add('in'), 200 + i * 130);
  });
}

// ---------- Loading screen ----------
function hideLoader() {
  document.getElementById('loading-screen')?.classList.add('hidden');
  playHeroReveal();
}
if (document.readyState === 'complete') setTimeout(hideLoader, 350);
else window.addEventListener('load', () => setTimeout(hideLoader, 350));

updateProgress();

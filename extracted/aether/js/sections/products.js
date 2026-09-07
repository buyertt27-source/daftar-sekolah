import { products, categories, findProduct, formatIDR } from '../data/products.js';
import { productArt } from '../utils/visual-art.js';
import { attachTilt, observeReveal, toast } from '../components/ui.js';
import { storage } from '../utils/storage.js';

const WISHLIST_KEY = 'wishlist';

export function getWishlist() { return storage.get(WISHLIST_KEY, []); }

export function toggleWishlist(id) {
  const list = getWishlist();
  const idx = list.indexOf(id);
  if (idx >= 0) list.splice(idx, 1); else list.push(id);
  storage.set(WISHLIST_KEY, list);
  window.dispatchEvent(new CustomEvent('aether:wishlist-updated', { detail: { list } }));
  return list;
}

function stars(rating) {
  const full = Math.round(rating);
  return '★'.repeat(full) + '☆'.repeat(5 - full);
}

function cardHTML(p) {
  const wished = getWishlist().includes(p.id);
  return `
    <article class="product-card" data-id="${p.id}">
      <div class="product-visual">
        ${productArt(p.type, p.seed)}
        <button class="wishlist-toggle${wished ? ' active' : ''}" data-action="wishlist" aria-label="Toggle wishlist">
          <svg viewBox="0 0 24 24" fill="${wished ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>
        </button>
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
      </div>
      <div class="product-info">
        <span class="product-cat">${p.category}</span>
        <h3>${p.name}</h3>
        <div class="rating-row"><span class="stars">${stars(p.rating)}</span><span>${p.rating} (${p.reviews})</span></div>
        <div class="price-row">
          <span class="price-now">${formatIDR(p.discountPrice || p.price)}</span>
          ${p.discountPrice ? `<span class="price-old">${formatIDR(p.price)}</span>` : ''}
        </div>
        <span class="stock-note${p.stock < 10 ? ' low' : ''}">${p.stock < 10 ? `Only ${p.stock} left` : 'In stock'}</span>
      </div>
      <div class="product-card-actions">
        <button class="btn btn-ghost" data-action="view">View</button>
        <button class="btn btn-primary" data-action="quick-add">Add to Cart</button>
      </div>
    </article>
  `;
}

export function renderProducts(openDetail, onQuickAdd) {
  const grid = document.getElementById('product-grid');
  const filterRow = document.getElementById('product-filters');
  if (!grid) return;

  let active = 'All';

  function draw() {
    const list = active === 'All' ? products : products.filter((p) => p.category === active);
    grid.innerHTML = list.map(cardHTML).join('');
    wireCards();
    observeReveal('#product-grid .product-card');
  }

  function wireCards() {
    grid.querySelectorAll('.product-card').forEach((card) => {
      const id = card.dataset.id;
      attachTilt(card.querySelector('.product-visual'), 5);
      card.querySelector('[data-action="view"]').addEventListener('click', () => openDetail(id));
      card.querySelector('.product-visual svg')?.addEventListener('click', () => openDetail(id));
      card.querySelector('[data-action="quick-add"]').addEventListener('click', (e) => {
        e.stopPropagation();
        const p = findProduct(id);
        onQuickAdd(p, {}, 1);
      });
      card.querySelector('[data-action="wishlist"]').addEventListener('click', (e) => {
        e.stopPropagation();
        const list = toggleWishlist(id);
        e.currentTarget.classList.toggle('active', list.includes(id));
        e.currentTarget.querySelector('svg').setAttribute('fill', list.includes(id) ? 'currentColor' : 'none');
      });
    });
  }

  if (filterRow) {
    filterRow.innerHTML = categories.map((c) => `<button class="chip${c === 'All' ? ' active' : ''}" data-cat="${c}">${c}</button>`).join('');
    filterRow.querySelectorAll('.chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        active = chip.dataset.cat;
        filterRow.querySelectorAll('.chip').forEach((c) => c.classList.toggle('active', c === chip));
        draw();
      });
    });
  }

  draw();
}

export function productDetailHTML(id) {
  const p = findProduct(id);
  if (!p) return '<p style="padding:2rem">Product not found.</p>';
  const variantEntries = Object.entries(p.variants || {});
  return `
    <div class="detail-grid">
      <div>
        <div class="detail-visual" data-role="main-visual">${productArt(p.type, p.seed)}</div>
        <div class="detail-gallery-thumbs">
          ${[p.seed, p.seed + 10, p.seed + 20].map((s, i) => `<button class="${i === 0 ? 'active' : ''}" data-seed="${s}">${productArt(p.type, s)}</button>`).join('')}
        </div>
      </div>
      <div class="detail-body">
        <div class="detail-meta-row"><span>${p.category}</span><span class="stars">${stars(p.rating)} (${p.reviews})</span></div>
        <h2>${p.name}</h2>
        <div class="detail-price-row">
          <span class="now">${formatIDR(p.discountPrice || p.price)}</span>
          ${p.discountPrice ? `<span class="price-old">${formatIDR(p.price)}</span>` : ''}
        </div>
        <p>${p.description}</p>
        <div class="detail-specs">
          ${Object.entries(p.specs).map(([k, v]) => `<div class="detail-spec-item"><span>${k}</span><b>${v}</b></div>`).join('')}
        </div>
        ${variantEntries.map(([label, opts]) => `
          <div class="variant-group" data-variant="${label}">
            <label>${label}</label>
            <div class="variant-options">${opts.map((o, i) => `<button class="variant-chip${i === 0 ? ' active' : ''}" data-value="${o}">${o}</button>`).join('')}</div>
          </div>
        `).join('')}
        <div class="variant-group">
          <label>Quantity</label>
          <div class="qty-stepper" style="width:fit-content">
            <button data-action="qty-dec">–</button>
            <span data-role="qty">1</span>
            <button data-action="qty-inc">+</button>
          </div>
          <span class="stock-note${p.stock < 10 ? ' low' : ''}" style="margin-left:1rem">${p.stock < 10 ? `Only ${p.stock} left` : 'In stock'}</span>
        </div>
        <div class="detail-actions">
          <button class="btn btn-ghost btn-block" data-action="add-cart">Add to Cart</button>
          <button class="btn btn-primary btn-block" data-action="buy-now">Buy Now</button>
        </div>
      </div>
    </div>
  `;
}

export function wireProductDetail(container, id, { onAddToCart, onBuyNow }) {
  const p = findProduct(id);
  if (!p) return;
  let qty = 1;
  const selection = {};
  Object.entries(p.variants || {}).forEach(([label, opts]) => { selection[label] = opts[0]; });

  container.querySelectorAll('.variant-group[data-variant]').forEach((group) => {
    const label = group.dataset.variant;
    group.querySelectorAll('.variant-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        group.querySelectorAll('.variant-chip').forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
        selection[label] = chip.dataset.value;
      });
    });
  });

  const qtyEl = container.querySelector('[data-role="qty"]');
  container.querySelector('[data-action="qty-inc"]').addEventListener('click', () => {
    qty = Math.min(p.stock, qty + 1);
    qtyEl.textContent = qty;
  });
  container.querySelector('[data-action="qty-dec"]').addEventListener('click', () => {
    qty = Math.max(1, qty - 1);
    qtyEl.textContent = qty;
  });

  container.querySelectorAll('.detail-gallery-thumbs button').forEach((thumb) => {
    thumb.addEventListener('click', () => {
      container.querySelectorAll('.detail-gallery-thumbs button').forEach((t) => t.classList.remove('active'));
      thumb.classList.add('active');
      container.querySelector('[data-role="main-visual"]').innerHTML = productArt(p.type, Number(thumb.dataset.seed));
    });
  });

  container.querySelector('[data-action="add-cart"]').addEventListener('click', () => {
    onAddToCart(p, { ...selection }, qty);
    toast.show(`${p.name} added to cart.`);
  });
  container.querySelector('[data-action="buy-now"]').addEventListener('click', () => {
    onAddToCart(p, { ...selection }, qty);
    onBuyNow();
  });
}

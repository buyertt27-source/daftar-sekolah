import { getOrders } from './commerce.js';
import { getWishlist } from './products.js';
import { findProduct, formatIDR } from '../data/products.js';
import { productArt } from '../utils/visual-art.js';
import { storage } from '../utils/storage.js';

function profileTabHTML() {
  const s = storage.get('lastShipping', null);
  return `
    <div style="text-align:center;padding:1rem 0 2rem">
      <div style="width:72px;height:72px;border-radius:50%;background:var(--titanium-800);border:1px solid var(--titanium-700);display:flex;align-items:center;justify-content:center;margin:0 auto 1rem;font-family:var(--font-display);font-size:1.5rem;color:var(--brass)">
        ${(s?.name || 'A')[0].toUpperCase()}
      </div>
      <h3 style="font-size:1.1rem">${s?.name || 'Welcome to Aether'}</h3>
      <p style="font-size:.85rem">${s?.email || 'Complete a purchase to save your profile details here.'}</p>
    </div>
    ${s ? `
      <div class="detail-spec-item" style="margin-bottom:.75rem"><span>Phone</span><b>${s.phone || '—'}</b></div>
      <div class="detail-spec-item"><span>Address</span><b>${s.address || '—'}${s.city ? `, ${s.city}` : ''}</b></div>
    ` : ''}
  `;
}

function ordersTabHTML() {
  const orders = getOrders();
  if (!orders.length) {
    return `<div class="empty-state"><h3>No orders yet</h3><p>Your completed purchases will show up here.</p></div>`;
  }
  return orders.map((o) => `
    <div class="order-row">
      <div>
        <b style="display:block">${o.id}</b>
        <span style="color:var(--ash);font-size:.75rem">${new Date(o.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })} · ${o.items.length} item(s)</span>
      </div>
      <div style="text-align:right">
        <div>${formatIDR(o.total)}</div>
        <span class="status paid">${o.status}</span>
      </div>
    </div>
  `).join('');
}

function wishlistTabHTML() {
  const ids = getWishlist();
  if (!ids.length) {
    return `<div class="empty-state"><h3>Your wishlist is empty</h3><p>Tap the heart on any product to save it here.</p></div>`;
  }
  return `<div class="wishlist-grid">${ids.map((id) => {
    const p = findProduct(id);
    if (!p) return '';
    return `
      <div data-id="${p.id}" style="cursor:pointer">
        <div style="aspect-ratio:1/1;border-radius:8px;overflow:hidden;border:1px solid var(--titanium-700)">${productArt(p.type, p.seed)}</div>
        <p style="font-size:.8rem;margin-top:.5rem;color:var(--ceramic)">${p.name}</p>
        <span style="font-size:.8rem;color:var(--ash)">${formatIDR(p.discountPrice || p.price)}</span>
      </div>
    `;
  }).join('')}</div>`;
}

export function initAccountPanel(openProductDetail) {
  const body = document.getElementById('account-body');
  const tabsEl = document.getElementById('account-tabs');
  if (!body || !tabsEl) return;
  let active = 'profile';

  function draw() {
    tabsEl.querySelectorAll('.account-tab').forEach((t) => t.classList.toggle('active', t.dataset.tab === active));
    if (active === 'profile') body.innerHTML = profileTabHTML();
    else if (active === 'orders') body.innerHTML = ordersTabHTML();
    else body.innerHTML = wishlistTabHTML();

    if (active === 'wishlist') {
      body.querySelectorAll('[data-id]').forEach((el) => el.addEventListener('click', () => openProductDetail(el.dataset.id)));
    }
  }

  tabsEl.querySelectorAll('.account-tab').forEach((tab) => {
    tab.addEventListener('click', () => { active = tab.dataset.tab; draw(); });
  });

  window.addEventListener('aether:open-account', draw);
  window.addEventListener('aether:order-placed', () => { if (active === 'orders') draw(); });
  window.addEventListener('aether:wishlist-updated', () => { if (active === 'wishlist') draw(); });

  draw();
}

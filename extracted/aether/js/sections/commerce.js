import { findProduct, formatIDR } from '../data/products.js';
import { productArt } from '../utils/visual-art.js';
import { storage } from '../utils/storage.js';
import { validateForm, rules, clearErrors } from '../utils/validators.js';
import { toast } from '../components/ui.js';

const CART_KEY = 'cart';
const PROMO_KEY = 'promo';
const ORDERS_KEY = 'orders';
const SHIPPING_KEY = 'lastShipping';
const FREE_SHIP_THRESHOLD = 3000000;
const FLAT_SHIP = 25000;
const PROMO_CODES = { AETHER10: 0.10, WELCOME15: 0.15 };

function variantKey(v) { return Object.entries(v || {}).sort().map(([k, val]) => `${k}:${val}`).join('|'); }

export function getCart() { return storage.get(CART_KEY, []); }
function saveCart(cart) {
  storage.set(CART_KEY, cart);
  const totals = computeTotals(cart);
  window.dispatchEvent(new CustomEvent('aether:cart-updated', { detail: totals }));
}

export function addToCart(product, variant, qty) {
  const cart = getCart();
  const key = variantKey(variant);
  const existing = cart.find((l) => l.productId === product.id && variantKey(l.variant) === key);
  if (existing) existing.qty = Math.min(product.stock, existing.qty + qty);
  else cart.push({ productId: product.id, variant, qty: Math.min(product.stock, qty) });
  saveCart(cart);
}

export function updateLineQty(productId, variant, delta) {
  const cart = getCart();
  const key = variantKey(variant);
  const line = cart.find((l) => l.productId === productId && variantKey(l.variant) === key);
  if (!line) return;
  const p = findProduct(productId);
  line.qty = Math.max(1, Math.min(p ? p.stock : 99, line.qty + delta));
  saveCart(cart);
}

export function removeLine(productId, variant) {
  const key = variantKey(variant);
  saveCart(getCart().filter((l) => !(l.productId === productId && variantKey(l.variant) === key)));
}

export function clearCart() { saveCart([]); }

export function getPromo() { return storage.get(PROMO_KEY, null); }
export function applyPromo(code) {
  const rate = PROMO_CODES[code.toUpperCase()];
  if (!rate) return false;
  storage.set(PROMO_KEY, { code: code.toUpperCase(), rate });
  saveCart(getCart());
  return true;
}
export function removePromo() { storage.remove(PROMO_KEY); saveCart(getCart()); }

export function computeTotals(cart) {
  let subtotal = 0, count = 0;
  cart.forEach((line) => {
    const p = findProduct(line.productId);
    if (!p) return;
    subtotal += (p.discountPrice || p.price) * line.qty;
    count += line.qty;
  });
  const promo = getPromo();
  const discount = promo ? subtotal * promo.rate : 0;
  const afterDiscount = subtotal - discount;
  const shipping = cart.length === 0 ? 0 : (afterDiscount >= FREE_SHIP_THRESHOLD ? 0 : FLAT_SHIP);
  const total = Math.max(0, afterDiscount + shipping);
  return { subtotal, discount, shipping, total, count, promo };
}

export function getOrders() { return storage.get(ORDERS_KEY, []); }
function saveOrder(order) {
  const orders = getOrders();
  orders.unshift(order);
  storage.set(ORDERS_KEY, orders.slice(0, 30));
}

function genOrderId() { return 'ORD-' + Math.random().toString(36).slice(2, 8).toUpperCase(); }

function mockQR(seedStr) {
  const n = 25;
  let seed = 0;
  for (let i = 0; i < seedStr.length; i++) seed += seedStr.charCodeAt(i);
  function finderPixel(lx, ly) {
    if (lx < 0 || lx > 6 || ly < 0 || ly > 6) return false;
    if (lx === 0 || lx === 6 || ly === 0 || ly === 6) return true;
    return lx >= 2 && lx <= 4 && ly >= 2 && ly <= 4;
  }
  const rects = [];
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      let on;
      if (x < 7 && y < 7) on = finderPixel(x, y);
      else if (x >= n - 7 && y < 7) on = finderPixel(x - (n - 7), y);
      else if (x < 7 && y >= n - 7) on = finderPixel(x, y - (n - 7));
      else on = ((x * 13 + y * 7 + seed) % 5) < 2;
      if (on) rects.push(`<rect x="${x}" y="${y}" width="1" height="1"/>`);
    }
  }
  return `<svg viewBox="0 0 ${n} ${n}" xmlns="http://www.w3.org/2000/svg" fill="#08090c">${rects.join('')}</svg>`;
}

function genVA() { return '8808' + String(Math.floor(1000000000 + Math.random() * 8999999999)).slice(0, 10); }

// ===================================================================
// Rendering
// ===================================================================

function lineHTML(line) {
  const p = findProduct(line.productId);
  if (!p) return '';
  const variantLabel = Object.values(line.variant || {}).join(' · ');
  return `
    <div class="cart-line" data-id="${p.id}" data-variant='${JSON.stringify(line.variant)}'>
      <div class="cart-line-visual">${productArt(p.type, p.seed)}</div>
      <div class="cart-line-info">
        <h4>${p.name}</h4>
        ${variantLabel ? `<div class="variant">${variantLabel}</div>` : ''}
        <div class="cart-line-bottom">
          <div class="qty-stepper">
            <button data-action="dec">–</button>
            <span>${line.qty}</span>
            <button data-action="inc">+</button>
          </div>
          <div>${formatIDR((p.discountPrice || p.price) * line.qty)}</div>
        </div>
        <button class="remove-line" data-action="remove">Remove</button>
      </div>
    </div>
  `;
}

function emptyCartHTML() {
  return `
    <div class="empty-state">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
      <h3>Your cart is empty</h3>
      <p>Explore the collection and add something you like.</p>
    </div>
  `;
}

export function initCommerce({ cartOverlay, checkoutOverlay, goToScene }) {
  const cartBody = document.getElementById('cart-drawer-body');
  const cartFoot = document.getElementById('cart-drawer-foot');
  const cartCountEls = document.querySelectorAll('.cart-count');
  const checkoutContent = document.getElementById('checkout-content');
  const checkoutStepsEl = document.getElementById('checkout-steps');

  let checkoutState = { step: 'shipping', shipping: storage.get(SHIPPING_KEY, null), method: null };

  function renderCart() {
    const cart = getCart();
    const totals = computeTotals(cart);
    cartCountEls.forEach((el) => { el.textContent = totals.count; el.dataset.count = totals.count; });

    if (cart.length === 0) {
      cartBody.innerHTML = emptyCartHTML();
      cartFoot.innerHTML = '';
      return;
    }

    cartBody.innerHTML = cart.map(lineHTML).join('');
    cartBody.querySelectorAll('.cart-line').forEach((el) => {
      const id = el.dataset.id;
      const variant = JSON.parse(el.dataset.variant);
      el.querySelector('[data-action="inc"]').addEventListener('click', () => { updateLineQty(id, variant, 1); renderCart(); });
      el.querySelector('[data-action="dec"]').addEventListener('click', () => { updateLineQty(id, variant, -1); renderCart(); });
      el.querySelector('[data-action="remove"]').addEventListener('click', () => { removeLine(id, variant); renderCart(); toast.show('Item removed from cart.'); });
    });

    cartFoot.innerHTML = `
      <div class="field" style="display:flex;gap:.5rem;margin-bottom:1rem">
        <input type="text" id="promo-input" placeholder="Promo code" value="${totals.promo?.code || ''}" ${totals.promo ? 'disabled' : ''}>
        <button class="btn btn-ghost" id="promo-btn">${totals.promo ? 'Remove' : 'Apply'}</button>
      </div>
      <div class="summary-row"><span>Subtotal</span><span>${formatIDR(totals.subtotal)}</span></div>
      ${totals.promo ? `<div class="summary-row"><span>Discount (${totals.promo.code})</span><span class="discount-val">−${formatIDR(totals.discount)}</span></div>` : ''}
      <div class="summary-row"><span>Shipping</span><span>${totals.shipping === 0 ? 'Free' : formatIDR(totals.shipping)}</span></div>
      <div class="summary-row total"><span>Total</span><span>${formatIDR(totals.total)}</span></div>
      <button class="btn btn-primary btn-block" id="go-checkout" style="margin-top:1rem">Checkout</button>
    `;
    document.getElementById('promo-btn').addEventListener('click', () => {
      if (totals.promo) { removePromo(); renderCart(); return; }
      const val = document.getElementById('promo-input').value.trim();
      if (applyPromo(val)) { toast.show('Promo code applied.'); renderCart(); }
      else toast.show('That promo code is not valid.', 'error');
    });
    document.getElementById('go-checkout').addEventListener('click', openCheckout);
  }

  function openCheckout() {
    cartOverlay.close();
    checkoutState.step = 'shipping';
    renderCheckout();
    checkoutOverlay.open();
  }

  function stepsHTML() {
    const steps = [['shipping', '1', 'Shipping'], ['payment', '2', 'Payment']];
    return steps.map(([id, num, label]) => {
      const isActive = checkoutState.step === id;
      const isDone = (id === 'shipping' && checkoutState.step !== 'shipping');
      return `<div class="checkout-step ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}"><span class="num">${num}</span><span class="label">${label}</span></div>`;
    }).join('');
  }

  function orderSummaryHTML() {
    const cart = getCart();
    const totals = computeTotals(cart);
    return `
      <div class="order-summary-card">
        <h3>Order Summary</h3>
        ${cart.map((line) => {
          const p = findProduct(line.productId);
          return `<div class="summary-line-item"><span>${p.name} × ${line.qty}</span><span>${formatIDR((p.discountPrice || p.price) * line.qty)}</span></div>`;
        }).join('')}
        <div class="summary-row"><span>Subtotal</span><span>${formatIDR(totals.subtotal)}</span></div>
        ${totals.promo ? `<div class="summary-row"><span>Discount</span><span class="discount-val">−${formatIDR(totals.discount)}</span></div>` : ''}
        <div class="summary-row"><span>Shipping</span><span>${totals.shipping === 0 ? 'Free' : formatIDR(totals.shipping)}</span></div>
        <div class="summary-row total"><span>Total</span><span>${formatIDR(totals.total)}</span></div>
      </div>
    `;
  }

  function shippingStepHTML() {
    const s = checkoutState.shipping || {};
    return `
      <div class="checkout-layout">
        <div>
          <h2 style="font-size:1.5rem;margin-bottom:1.5rem">Shipping details</h2>
          <form id="shipping-form" novalidate>
            <div class="field"><label>Full name</label><input name="name" value="${s.name || ''}"><div class="field-error"></div></div>
            <div class="field-row">
              <div class="field"><label>Email</label><input name="email" type="email" value="${s.email || ''}"><div class="field-error"></div></div>
              <div class="field"><label>Phone number</label><input name="phone" value="${s.phone || ''}"><div class="field-error"></div></div>
            </div>
            <div class="field"><label>Address</label><input name="address" value="${s.address || ''}"><div class="field-error"></div></div>
            <div class="field-row">
              <div class="field"><label>City</label><input name="city" value="${s.city || ''}"><div class="field-error"></div></div>
              <div class="field"><label>Province</label><input name="province" value="${s.province || ''}"><div class="field-error"></div></div>
            </div>
            <div class="field"><label>Postal code</label><input name="postal" value="${s.postal || ''}"><div class="field-error"></div></div>
            <button class="btn btn-primary btn-block" type="submit">Continue to Payment</button>
          </form>
        </div>
        ${orderSummaryHTML()}
      </div>
    `;
  }

  function paymentStepHTML() {
    const methods = [
      { id: 'qris', label: 'QRIS', hint: 'Scan with any app', icon: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM15 15h2v2h-2zM19 15h1v1h-1zM15 19h1v1h-1zM19 19h1v1h-1z' },
      { id: 'bank', label: 'Bank Transfer', hint: 'BCA / Mandiri / BNI', icon: 'M3 21h18M4 10h16M4 10l8-6 8 6M6 10v9M10 10v9M14 10v9M18 10v9' },
      { id: 'ewallet', label: 'E-Wallet', hint: 'GoPay / OVO / DANA', icon: 'M3 7h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3zM17 12h3a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-3' },
      { id: 'va', label: 'Virtual Account', hint: 'Auto-verified', icon: 'M4 4h16v16H4zM8 8h8v8H8z' },
      { id: 'card', label: 'Credit / Debit Card', hint: 'Visa / Mastercard', icon: 'M2 8h20M2 6h20a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zM6 15h4' }
    ];
    return `
      <div class="checkout-layout">
        <div>
          <h2 style="font-size:1.5rem;margin-bottom:1.5rem">Choose payment method</h2>
          <div class="pay-methods">
            ${methods.map((m) => `
              <button class="pay-method" data-method="${m.id}">
                <span class="pic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="${m.icon}"/></svg></span>
                <span><b>${m.label}</b><span>${m.hint}</span></span>
              </button>
            `).join('')}
          </div>
          <div id="pay-detail"></div>
        </div>
        ${orderSummaryHTML()}
      </div>
    `;
  }

  function payDetailHTML(method) {
    const orderId = genOrderId();
    if (method === 'qris') {
      return `
        <div class="pay-detail-panel">
          <div class="qr-box">${mockQR(orderId)}</div>
          <p style="margin:0 0 .25rem">Scan this QRIS code with any e-wallet or mobile banking app.</p>
          <span class="demo-flag">Demo simulation — no real charge</span><br><br>
          <button class="btn btn-primary" id="simulate-pay">Simulate Payment</button>
        </div>`;
    }
    if (method === 'bank' || method === 'va') {
      const va = genVA();
      return `
        <div class="pay-detail-panel">
          <p style="margin-bottom:.5rem">${method === 'bank' ? 'Transfer to Virtual Account' : 'Your Virtual Account number'}</p>
          <div class="va-number">${va}</div>
          <button class="copy-btn" id="copy-va">Copy number</button><br><br>
          <span class="demo-flag">Demo simulation — no real charge</span><br><br>
          <button class="btn btn-primary" id="simulate-pay">I've made the transfer</button>
        </div>`;
    }
    if (method === 'ewallet') {
      return `
        <div class="pay-detail-panel">
          <div class="variant-options" style="justify-content:center;margin-bottom:1rem">
            ${['GoPay', 'OVO', 'DANA', 'ShopeePay'].map((w, i) => `<button class="variant-chip${i === 0 ? ' active' : ''}" data-wallet="${w}">${w}</button>`).join('')}
          </div>
          <p>You'll be redirected to complete payment in your chosen wallet app.</p>
          <span class="demo-flag">Demo simulation — no real charge</span><br><br>
          <button class="btn btn-primary" id="simulate-pay">Simulate Payment</button>
        </div>`;
    }
    return `
      <div class="pay-detail-panel" style="text-align:left">
        <div class="field"><label>Card number</label><input name="cardNumber" placeholder="4111 1111 1111 1111"><div class="field-error"></div></div>
        <div class="field-row">
          <div class="field"><label>Expiry (MM/YY)</label><input name="cardExpiry" placeholder="08/29"><div class="field-error"></div></div>
          <div class="field"><label>CVC</label><input name="cardCvc" placeholder="123"><div class="field-error"></div></div>
        </div>
        <span class="demo-flag">Demo simulation — no real charge</span><br><br>
        <button class="btn btn-primary btn-block" id="simulate-pay">Pay Now</button>
      </div>`;
  }

  function successStepHTML(order) {
    return `
      <div class="pay-success">
        <div class="success-ring"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg></div>
        <h2 style="font-size:1.5rem">Payment successful</h2>
        <p>Your order has been placed and is now being prepared.</p>
        <div class="order-id-tag">${order.id}</div>
        ${orderRecapHTML(order)}
        <button class="btn btn-primary" id="back-home-btn" style="margin-top:1.5rem">Back to Home</button>
      </div>
    `;
  }

  function orderRecapHTML(order) {
    return `
      <div class="order-summary-card" style="text-align:left;max-width:420px;margin:1.5rem auto 0">
        ${order.items.map((it) => `<div class="summary-line-item"><span>${it.name} × ${it.qty}</span><span>${formatIDR(it.price * it.qty)}</span></div>`).join('')}
        <div class="summary-row total"><span>Total paid</span><span>${formatIDR(order.total)}</span></div>
        <div class="summary-row"><span>Method</span><span>${order.paymentMethod}</span></div>
        <div class="summary-row"><span>Status</span><span style="color:var(--sapphire)">${order.status}</span></div>
      </div>
    `;
  }

  function renderCheckout() {
    checkoutStepsEl.innerHTML = stepsHTML();
    if (checkoutState.step === 'shipping') {
      checkoutContent.innerHTML = shippingStepHTML();
      wireShippingStep();
    } else if (checkoutState.step === 'payment') {
      checkoutContent.innerHTML = paymentStepHTML();
      wirePaymentStep();
    }
  }

  function wireShippingStep() {
    const form = document.getElementById('shipping-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors(form);
      const ok = validateForm(form, {
        name: [rules.required],
        email: [rules.required, rules.email],
        phone: [rules.required, rules.phone],
        address: [rules.required, rules.minLen(6)],
        city: [rules.required],
        province: [rules.required],
        postal: [rules.required, rules.postal]
      });
      if (!ok) return;
      const data = Object.fromEntries(new FormData(form).entries());
      checkoutState.shipping = data;
      storage.set(SHIPPING_KEY, data);
      checkoutState.step = 'payment';
      renderCheckout();
    });
  }

  function wirePaymentStep() {
    const detailWrap = document.getElementById('pay-detail');
    document.querySelectorAll('.pay-method').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.pay-method').forEach((b) => b.classList.remove('selected'));
        btn.classList.add('selected');
        checkoutState.method = btn.dataset.method;
        detailWrap.innerHTML = payDetailHTML(btn.dataset.method);
        wireSimulateButton();
      });
    });
  }

  function wireSimulateButton() {
    const btn = document.getElementById('simulate-pay');
    if (!btn) return;
    document.getElementById('copy-va')?.addEventListener('click', (e) => {
      const num = e.target.closest('.pay-detail-panel').querySelector('.va-number').textContent;
      navigator.clipboard?.writeText(num).then(() => toast.show('Virtual account number copied.'));
    });
    document.querySelectorAll('[data-wallet]').forEach((chip) => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('[data-wallet]').forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
      });
    });
    btn.addEventListener('click', () => {
      if (checkoutState.method === 'card') {
        const panel = btn.closest('.pay-detail-panel');
        const ok = validateForm(panel, {
          cardNumber: [rules.required, rules.cardNumber],
          cardExpiry: [rules.required, rules.cardExpiry],
          cardCvc: [rules.required, rules.cardCvc]
        });
        if (!ok) return;
      }
      processPayment();
    });
  }

  function processPayment() {
    const methodLabels = { qris: 'QRIS', bank: 'Bank Transfer', ewallet: 'E-Wallet', va: 'Virtual Account', card: 'Credit / Debit Card' };
    checkoutContent.innerHTML = `<div class="processing-spin"><div class="ring"></div><p>Processing your payment…</p></div>`;
    setTimeout(() => {
      const cart = getCart();
      const totals = computeTotals(cart);
      const order = {
        id: genOrderId(),
        date: new Date().toISOString(),
        items: cart.map((line) => {
          const p = findProduct(line.productId);
          return { id: p.id, name: p.name, qty: line.qty, price: p.discountPrice || p.price };
        }),
        subtotal: totals.subtotal, discount: totals.discount, shipping: totals.shipping, total: totals.total,
        paymentMethod: methodLabels[checkoutState.method] || 'Unknown',
        status: 'Paid',
        customer: { name: checkoutState.shipping?.name || 'Guest', email: checkoutState.shipping?.email || '' }
      };
      saveOrder(order);
      clearCart();
      checkoutContent.innerHTML = successStepHTML(order);
      document.getElementById('back-home-btn').addEventListener('click', () => {
        checkoutOverlay.close();
        goToScene('home');
      });
      window.dispatchEvent(new CustomEvent('aether:order-placed', { detail: order }));
    }, 1400);
  }

  window.addEventListener('aether:cart-updated', renderCart);
  window.addEventListener('aether:open-cart', () => { renderCart(); cartOverlay.open(); });
  document.getElementById('open-cart-btn')?.addEventListener('click', () => { renderCart(); cartOverlay.open(); });

  renderCart();

  return { openCheckout, renderCart };
}

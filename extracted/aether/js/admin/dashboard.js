import { products, findProduct, formatIDR } from '../data/products.js';
import { productArt } from '../utils/visual-art.js';
import { getOrders as getRealOrders } from '../sections/commerce.js';
import { toast } from '../components/ui.js';

// ---------- Deterministic mock data (stable across reloads) ----------
function seededRandom(seed) {
  let s = seed;
  return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
}

const MOCK_CUSTOMERS = [
  { name: 'Dewi Anjani', email: 'dewi.anjani@example.com' },
  { name: 'Raka Pratama', email: 'raka.pratama@example.com' },
  { name: 'Siti Nurhaliza', email: 'siti.n@example.com' },
  { name: 'Bayu Segara', email: 'bayu.segara@example.com' },
  { name: 'Amanda Putri', email: 'amanda.putri@example.com' },
  { name: 'Fajar Ramadhan', email: 'fajar.r@example.com' },
  { name: 'Kirana Ayu', email: 'kirana.ayu@example.com' },
  { name: 'Yusuf Maulana', email: 'yusuf.m@example.com' },
  { name: 'Michelle Tanoto', email: 'michelle.t@example.com' },
  { name: 'Arief Wicaksono', email: 'arief.w@example.com' },
  { name: 'Nadia Salsabila', email: 'nadia.s@example.com' },
  { name: 'Gilang Ramadhan', email: 'gilang.r@example.com' }
];
const PAYMENT_METHODS = ['QRIS', 'Bank Transfer', 'E-Wallet', 'Virtual Account', 'Credit / Debit Card'];
const STATUS_POOL = ['Paid', 'Paid', 'Paid', 'Paid', 'Pending', 'Failed'];

function generateMockOrders(count) {
  const rand = seededRandom(42);
  const orders = [];
  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(rand() * 90);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    const customer = MOCK_CUSTOMERS[Math.floor(rand() * MOCK_CUSTOMERS.length)];
    const itemCount = 1 + Math.floor(rand() * 3);
    const items = [];
    let subtotal = 0;
    for (let j = 0; j < itemCount; j++) {
      const p = products[Math.floor(rand() * products.length)];
      const qty = 1 + Math.floor(rand() * 2);
      const price = p.discountPrice || p.price;
      items.push({ id: p.id, name: p.name, qty, price });
      subtotal += price * qty;
    }
    const shipping = subtotal > 3000000 ? 0 : 25000;
    orders.push({
      id: 'ORD-' + (581000 + i * 7).toString(36).toUpperCase(),
      date: date.toISOString(),
      items, subtotal, discount: 0, shipping, total: subtotal + shipping,
      paymentMethod: PAYMENT_METHODS[Math.floor(rand() * PAYMENT_METHODS.length)],
      status: STATUS_POOL[Math.floor(rand() * STATUS_POOL.length)],
      customer
    });
  }
  return orders;
}

function generateDailySeries(days) {
  const rand = seededRandom(7);
  const arr = [];
  let base = 9000000;
  for (let i = days - 1; i >= 0; i--) {
    base += (rand() - 0.44) * 1400000;
    base = Math.max(2500000, Math.min(28000000, base));
    const date = new Date();
    date.setDate(date.getDate() - i);
    arr.push({ date, revenue: Math.round(base) });
  }
  return arr;
}

function aggregateWeekly(daily, weeksBack) {
  const out = [];
  for (let i = weeksBack - 1; i >= 0; i--) {
    const slice = daily.slice(Math.max(0, daily.length - (i + 1) * 7), daily.length - i * 7);
    if (!slice.length) continue;
    out.push({ label: `W-${i}`, value: slice.reduce((s, d) => s + d.revenue, 0) });
  }
  out[out.length - 1].label = 'This wk';
  return out;
}

function aggregateMonthly(daily, monthsBack) {
  const map = new Map();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  daily.forEach((d) => {
    const key = `${d.date.getFullYear()}-${d.date.getMonth()}`;
    map.set(key, (map.get(key) || 0) + d.revenue);
  });
  return Array.from(map.entries()).slice(-monthsBack).map(([key, val]) => ({ label: monthNames[Number(key.split('-')[1])], value: val }));
}

const DAILY_180 = generateDailySeries(180);
const MOCK_ORDERS = generateMockOrders(46);

function allOrders() {
  return [...getRealOrders(), ...MOCK_ORDERS].sort((a, b) => new Date(b.date) - new Date(a.date));
}

// ---------- Icons ----------
const ICONS = {
  revenue: '<path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>',
  orders: '<path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>',
  products: '<path d="M20.59 13.41L11 3.83V3H3v8h.83l9.58 9.59a2 2 0 002.83 0l4.35-4.35a2 2 0 000-2.83z"/><circle cx="7" cy="7" r="1.5"/>',
  aov: '<path d="M23 6l-9.5 9.5-5-5L1 18"/><path d="M17 6h6v6"/>',
  conversion: '<circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 6-6"/>',
  customers: '<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>',
  payments: '<rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>'
};
function icon(name) { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">${ICONS[name] || ''}</svg>`; }

// ---------- Reusable line chart (hover tooltip + draw-in animation) ----------
function renderLineChart(svg, tooltip, data, color = '#c9a876') {
  if (!svg || !data.length) return;
  const w = 700, h = 240, padL = 6, padR = 6, padT = 16, padB = 26;
  const values = data.map((d) => d.value);
  const max = Math.max(...values) * 1.1 || 1;
  const min = 0;
  const xStep = (w - padL - padR) / Math.max(1, data.length - 1);
  const pts = data.map((d, i) => ({
    x: padL + i * xStep,
    y: padT + (1 - (d.value - min) / (max - min)) * (h - padT - padB),
    ...d
  }));
  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const uid = Math.random().toString(36).slice(2, 7);

  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  svg.innerHTML = `
    <defs><linearGradient id="lc-${uid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${color}" stop-opacity="0.32"/>
      <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
    </linearGradient></defs>
    ${[0, 1, 2, 3].map((i) => `<line x1="0" y1="${padT + (i / 3) * (h - padT - padB)}" x2="${w}" y2="${padT + (i / 3) * (h - padT - padB)}" stroke="#1a1d24" stroke-width="1"/>`).join('')}
    <path d="${path} L${pts[pts.length - 1].x},${h - padB} L${pts[0].x},${h - padB} Z" fill="url(#lc-${uid})"/>
    <path d="${path}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" id="line-${uid}"/>
    <rect x="0" y="0" width="${w}" height="${h}" fill="transparent" style="cursor:crosshair" id="hover-${uid}"/>
  `;

  const line = svg.querySelector(`#line-${uid}`);
  const len = line.getTotalLength();
  line.style.strokeDasharray = len;
  line.style.strokeDashoffset = len;
  requestAnimationFrame(() => {
    line.style.transition = 'stroke-dashoffset 1s cubic-bezier(.16,1,.3,1)';
    line.style.strokeDashoffset = '0';
  });

  const hoverEl = svg.querySelector(`#hover-${uid}`);
  hoverEl.addEventListener('mousemove', (e) => {
    const rect = svg.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * w;
    let closest = pts[0], dist = Infinity;
    pts.forEach((p) => { const d = Math.abs(p.x - mx); if (d < dist) { dist = d; closest = p; } });
    if (!tooltip) return;
    tooltip.style.display = 'block';
    tooltip.style.left = `${(closest.x / w) * 100}%`;
    tooltip.style.top = `${(closest.y / h) * 100}%`;
    tooltip.innerHTML = `<b>${formatIDR(closest.value)}</b><span>${closest.label}</span>`;
  });
  hoverEl.addEventListener('mouseleave', () => { if (tooltip) tooltip.style.display = 'none'; });
}

function barListHTML(rows) {
  const max = Math.max(...rows.map((r) => r.value), 1);
  return rows.map((r) => `
    <div class="bar-row">
      <span class="label">${r.label}</span>
      <span class="track"><span class="fill" data-w="${(r.value / max) * 100}"></span></span>
      <span class="val">${formatIDR(r.value)}</span>
    </div>
  `).join('');
}
function animateBars(container) {
  container.querySelectorAll('.fill').forEach((el, i) => {
    setTimeout(() => { el.style.width = `${el.dataset.w}%`; }, 80 + i * 60);
  });
}

// ---------- Table HTML ----------
function ordersTableHTML(orders, limit) {
  const list = limit ? orders.slice(0, limit) : orders;
  return `
    <table class="admin-table">
      <thead><tr><th>Order</th><th>Customer</th><th>Date</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th></tr></thead>
      <tbody>${list.map((o) => `
        <tr>
          <td>${o.id}</td>
          <td>${o.customer?.name || 'Guest'}</td>
          <td>${new Date(o.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
          <td>${o.items.reduce((s, it) => s + it.qty, 0)}</td>
          <td>${formatIDR(o.total)}</td>
          <td>${o.paymentMethod}</td>
          <td><span class="status-pill ${o.status.toLowerCase()}">${o.status}</span></td>
        </tr>
      `).join('')}</tbody>
    </table>
  `;
}

function productsTableHTML() {
  return `
    <table class="admin-table">
      <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Rating</th></tr></thead>
      <tbody>${products.map((p) => `
        <tr>
          <td style="display:flex;align-items:center;gap:.75rem">
            <span style="width:32px;height:32px;border-radius:6px;overflow:hidden;display:inline-block;flex-shrink:0">${productArt(p.type, p.seed)}</span>
            ${p.name}
          </td>
          <td>${p.category}</td>
          <td>${formatIDR(p.discountPrice || p.price)}</td>
          <td ${p.stock < 10 ? 'style="color:var(--danger)"' : ''}>${p.stock}</td>
          <td>${p.rating} ★</td>
        </tr>
      `).join('')}</tbody>
    </table>
  `;
}

function customersTableHTML(orders) {
  const map = new Map();
  orders.forEach((o) => {
    const key = o.customer?.email || 'guest';
    if (!map.has(key)) map.set(key, { name: o.customer?.name || 'Guest', email: key, orders: 0, spend: 0 });
    const c = map.get(key);
    c.orders += 1; c.spend += o.total;
  });
  const list = Array.from(map.values()).sort((a, b) => b.spend - a.spend);
  return `
    <table class="admin-table">
      <thead><tr><th>Customer</th><th>Email</th><th>Orders</th><th>Total Spend</th></tr></thead>
      <tbody>${list.map((c) => `<tr><td>${c.name}</td><td>${c.email}</td><td>${c.orders}</td><td>${formatIDR(c.spend)}</td></tr>`).join('')}</tbody>
    </table>
  `;
}

function topProductsByRevenue(orders, n) {
  const totals = {};
  orders.forEach((o) => o.items.forEach((it) => { totals[it.name] = (totals[it.name] || 0) + it.qty * it.price; }));
  return Object.entries(totals).sort((a, b) => b[1] - a[1]).slice(0, n).map(([name, value]) => ({ name, value, product: products.find((p) => p.name === name) }));
}

function categoryBreakdown(orders) {
  const totals = {};
  orders.forEach((o) => o.items.forEach((it) => {
    const p = findProduct(it.id) || products.find((pp) => pp.name === it.name);
    const cat = p ? p.category : 'Other';
    totals[cat] = (totals[cat] || 0) + it.qty * it.price;
  }));
  return Object.entries(totals).sort((a, b) => b[1] - a[1]).map(([label, value]) => ({ label, value }));
}

// ---------- View renderers ----------
export function initAdminDashboard() {
  const orders = allOrders();
  const paid = orders.filter((o) => o.status === 'Paid');
  const revenue = paid.reduce((s, o) => s + o.total, 0);
  const aov = paid.length ? revenue / paid.length : 0;

  document.getElementById('kpi-grid').innerHTML = `
    <div class="kpi-card"><div class="kpi-top"><span class="kpi-ic">${icon('revenue')}</span><span class="kpi-delta">+12.4%</span></div><b>${formatIDR(revenue)}</b><span>Total Revenue</span></div>
    <div class="kpi-card"><div class="kpi-top"><span class="kpi-ic">${icon('orders')}</span><span class="kpi-delta">+8.1%</span></div><b>${orders.length.toLocaleString('id-ID')}</b><span>Total Orders</span></div>
    <div class="kpi-card"><div class="kpi-top"><span class="kpi-ic">${icon('products')}</span><span class="kpi-delta">—</span></div><b>${products.length}</b><span>Total Products</span></div>
    <div class="kpi-card"><div class="kpi-top"><span class="kpi-ic">${icon('aov')}</span><span class="kpi-delta">+3.2%</span></div><b>${formatIDR(aov)}</b><span>Avg. Order Value</span></div>
  `;

  function mountPeriodChart(svgId, tipId, filterId) {
    const svg = document.getElementById(svgId);
    const tip = document.getElementById(tipId);
    const filterEl = document.getElementById(filterId);
    function draw(period) {
      let data;
      if (period === 'day') data = DAILY_180.slice(-14).map((d) => ({ label: `${d.date.getDate()}/${d.date.getMonth() + 1}`, value: d.revenue }));
      else if (period === 'week') data = aggregateWeekly(DAILY_180, 10);
      else data = aggregateMonthly(DAILY_180, 6);
      renderLineChart(svg, tip, data);
    }
    filterEl?.querySelectorAll('button').forEach((btn) => {
      btn.addEventListener('click', () => {
        filterEl.querySelectorAll('button').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        draw(btn.dataset.period);
      });
    });
    draw('day');
  }

  const rendered = new Set();
  function renderView(name) {
    if (rendered.has(name)) return;
    rendered.add(name);
    if (name === 'dashboard') {
      document.getElementById('top-products-list').innerHTML = topProductsByRevenue(orders, 5).map((row, i) => `
        <div class="top-product-row">
          <span class="rank">${i + 1}</span>
          <span class="visual">${row.product ? productArt(row.product.type, row.product.seed) : ''}</span>
          <div class="info"><b>${row.name}</b><span>${orders.filter((o) => o.items.some((it) => it.name === row.name)).length} orders</span></div>
          <span class="amt">${formatIDR(row.value)}</span>
        </div>
      `).join('');
      document.getElementById('recent-orders-table').innerHTML = ordersTableHTML(orders, 6);
      mountPeriodChart('dash-chart', 'dash-tooltip', 'dash-period-filter');
    } else if (name === 'products') {
      document.getElementById('view-products').innerHTML = `<div class="panel">${productsTableHTML()}</div>`;
    } else if (name === 'orders') {
      document.getElementById('view-orders').innerHTML = `<div class="panel">${ordersTableHTML(orders)}</div>`;
    } else if (name === 'customers') {
      document.getElementById('view-customers').innerHTML = `<div class="panel">${customersTableHTML(orders)}</div>`;
    } else if (name === 'sales') {
      document.getElementById('view-sales').innerHTML = `
        <div class="stat-strip" style="margin-bottom:1.5rem">
          <div class="stat-card"><b>${formatIDR(revenue)}</b><span>Total Sales</span></div>
          <div class="stat-card"><b>${orders.length}</b><span>Total Orders</span></div>
          <div class="stat-card"><b>3.8%</b><span>Conversion Rate</span></div>
          <div class="stat-card"><b>${formatIDR(aov)}</b><span>Avg. Order Value</span></div>
        </div>
        <div class="panel">
          <div class="panel-head">
            <h3>Sales over time</h3>
            <div class="period-filter" id="sales-period-filter">
              <button class="active" data-period="day">Day</button><button data-period="week">Week</button><button data-period="month">Month</button>
            </div>
          </div>
          <div class="chart-wrap"><svg id="sales-chart"></svg><div class="chart-tooltip" id="sales-tooltip"></div></div>
        </div>
      `;
      mountPeriodChart('sales-chart', 'sales-tooltip', 'sales-period-filter');
    } else if (name === 'analytics') {
      const cats = categoryBreakdown(orders);
      const top = topProductsByRevenue(orders, 6);
      document.getElementById('view-analytics').innerHTML = `
        <div class="admin-grid-2">
          <div class="panel">
            <div class="panel-head"><h3>Top products by revenue</h3></div>
            <div id="an-top-products">${barListHTML(top.map((t) => ({ label: t.name, value: t.value })))}</div>
          </div>
          <div class="panel">
            <div class="panel-head"><h3>Revenue by category</h3></div>
            <div id="an-categories">${barListHTML(cats)}</div>
          </div>
        </div>
      `;
      animateBars(document.getElementById('an-top-products'));
      animateBars(document.getElementById('an-categories'));
    } else if (name === 'payments') {
      const methodTotals = {};
      orders.forEach((o) => { methodTotals[o.paymentMethod] = (methodTotals[o.paymentMethod] || 0) + 1; });
      document.getElementById('view-payments').innerHTML = `
        <div class="admin-grid-2">
          <div class="panel">${ordersTableHTML(orders, 20)}</div>
          <div class="panel">
            <div class="panel-head"><h3>By method</h3></div>
            ${barListHTML(Object.entries(methodTotals).map(([label, value]) => ({ label, value })))}
          </div>
        </div>
      `;
      animateBars(document.getElementById('view-payments'));
    } else if (name === 'settings') {
      document.getElementById('view-settings').innerHTML = `
        <div class="panel">
          <div class="panel-head"><h3>Store settings</h3></div>
          <div class="settings-form">
            <div class="field"><label>Store name</label><input value="Aether Studio"></div>
            <div class="field"><label>Currency</label><input value="IDR — Indonesian Rupiah"></div>
            <div class="field"><label>Support email</label><input value="hello@aether.studio"></div>
            <button class="btn btn-primary" id="save-settings-btn" style="width:fit-content">Save changes</button>
            <span class="demo-flag" style="width:fit-content">Demo only — not persisted</span>
          </div>
        </div>
      `;
      document.getElementById('save-settings-btn').addEventListener('click', () => toast.show('Settings saved (demo).'));
    }
  }

  document.querySelectorAll('.admin-nav a[data-view]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const view = link.dataset.view;
      document.querySelectorAll('.admin-nav a').forEach((a) => a.classList.toggle('active', a === link));
      document.querySelectorAll('.admin-view').forEach((v) => v.classList.toggle('active', v.id === `view-${view}`));
      document.getElementById('admin-sidebar')?.classList.remove('open');
      document.getElementById('admin-sidebar-overlay')?.classList.remove('open');
      renderView(view);
    });
  });

  document.getElementById('admin-menu-btn')?.addEventListener('click', () => {
    document.getElementById('admin-sidebar').classList.add('open');
    document.getElementById('admin-sidebar-overlay').classList.add('open');
  });
  document.getElementById('admin-sidebar-overlay')?.addEventListener('click', () => {
    document.getElementById('admin-sidebar').classList.remove('open');
    document.getElementById('admin-sidebar-overlay').classList.remove('open');
  });

  renderView('dashboard');
}

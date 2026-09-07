# Aether — Premium 3D Interactive Storefront

A dark, premium product site for a fictional precision-audio/wearables studio
("Aether"), combining a 3D scene-swipe experience, a portfolio, a working
e-commerce flow (cart → checkout → simulated payment), and a separate admin
analytics dashboard.

## Run it

No build step and no `npm install` required — this is plain HTML/CSS/JS.

- **Easiest:** double-click `index.html` to open it directly in a browser.
- **Recommended** (avoids occasional browser file:// quirks):
  ```
  npx serve .
  ```
  or
  ```
  python3 -m http.server 8080
  ```
  then open the printed local address. Any static file server works —
  there's no backend.

Open `admin.html` (or use the "Open full dashboard" / footer link from the
storefront) for the admin analytics panel.

## Why vanilla JS instead of React + Vite + R3F

The brief allowed either stack. This build uses **HTML5 + CSS3 + ES modules +
Three.js**, for two concrete reasons:

1. It needed to be something you could open and use immediately, with zero
   install step.
2. It's self-contained — no bundler, no `node_modules`, nothing to go stale.

Three.js and Google Fonts load from a CDN at runtime (your browser fetches
them when you open the page); everything else is local. If Three.js's CDN
ever fails to load, the site still works fully — the 3D backdrop and hero
object are decorative and degrade gracefully rather than breaking the page.

If you'd rather have the React/Vite/React-Three-Fiber version for a larger
team codebase, that's a reasonable follow-up — ask and it can be built next.

## Structure

```
aether/
├── index.html              storefront: hero, portfolio, products, sales
│                            preview, contact/footer, cart/checkout/payment
│                            modals, account panel
├── admin.html               admin dashboard (separate app shell)
├── css/
│   ├── base.css              design tokens, reset, typography, buttons
│   ├── layout.css             navbar, 3D scene-swipe system, hero, footer
│   ├── components.css        cards, forms, modals, cart, checkout, payment
│   ├── admin.css              admin-only layout
│   └── responsive.css        all breakpoints (large monitor → 380px)
├── js/
│   ├── main.js                 app bootstrap — wires everything together
│   ├── data/                   mock product & portfolio catalogs
│   ├── utils/                  storage, perf/reduced-motion, validators,
│   │                            procedural SVG art generator
│   ├── components/ui.js        navbar, search, toasts, modal/drawer helpers
│   ├── animations/              3D scene-swipe engine + Three.js backdrop
│   ├── sections/                portfolio, products, cart/checkout/payment,
│   │                            contact, account panel
│   └── admin/dashboard.js      admin data + interactive charts + views
└── README.md
```

## What's real vs. simulated

- **Cart, wishlist, and shipping info persist** via `localStorage` — refresh
  the page and they're still there.
- **Checkout and payment are a simulation.** No real charge, no real gateway.
  QRIS/VA numbers shown are visually generated, not connected to any bank —
  this is explicitly labeled in the UI as demo data, per the brief.
- **Completed orders are saved** to `localStorage` and genuinely show up
  afterward in both the storefront's account panel (Orders tab) and the
  admin dashboard's Recent Orders / Orders table — the two aren't just
  visually similar, they read the same underlying data.
- **Admin analytics** blend that real order history with a larger set of
  deterministic (seeded, not random-every-reload) mock orders so the
  dashboard reads as a populated store rather than an empty one. Everything
  is labeled "Demo data."
- **Product and portfolio imagery is procedurally generated SVG**, not
  photography — this avoids hotlinking real (likely trademarked) product
  photos for a fictional brand, and stays perfectly sharp at any size since
  SVG has no fixed resolution. Swap in real photography for production.

## Known simplifications

- The customer **account section is a compact panel** (profile / orders /
  wishlist), not a full separate page — reasonable given the overall scope;
  it's a natural next piece to expand.
- Charts are **hand-built SVG** (with hover tooltips, period filters, and
  draw-in animation) rather than a charting library — this was a deliberate
  reliability choice: no external chart-library CDN link to potentially
  fail, at the cost of fewer chart types than a full library would offer.
- There's no real backend, auth, or payment gateway — everything client-side
  state is `localStorage`-backed mock data, as the brief asked for.
- Text fields (name, address, message, etc.) aren't HTML-escaped before
  display. For a single-user local demo this has no real exposure, but a
  production build talking to a real backend should sanitize/escape any
  user-submitted text before rendering it.

## Testing note

This was built and syntax-validated (ES module parsing, cross-file
import/export matching, CSS brace balance, DOM id cross-referencing) in a
sandboxed environment without a browser. It has **not** been visually
tested on a real device or browser. Please check the usual things — actual
touch feel on a phone, wheel feel on a trackpad vs. a mouse, and any console
errors — and report anything that looks off.

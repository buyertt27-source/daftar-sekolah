// Product catalog — demo data. IDR pricing.

export const categories = ['All', 'Audio', 'Wearable', 'Home'];

export const products = [
  {
    id: 'p1', name: 'Aether Loop Earbuds', category: 'Audio', type: 'earbuds', seed: 1,
    price: 2499000, discountPrice: 1999000, rating: 4.8, reviews: 214, stock: 32,
    badge: 'Best Seller',
    description: 'Titanium-shelled true wireless earbuds tuned for a wide, neutral soundstage with adaptive noise cancellation.',
    specs: { 'Driver': '11mm titanium-coated', 'Battery': '8h + 24h case', 'Connectivity': 'Bluetooth 5.3', 'Weather rating': 'IPX5' },
    variants: { Color: ['Titanium', 'Graphite', 'Champagne'] }
  },
  {
    id: 'p2', name: 'Aether Ring Watch', category: 'Wearable', type: 'watch', seed: 2,
    price: 4299000, discountPrice: null, rating: 4.6, reviews: 132, stock: 18,
    badge: 'New',
    description: 'A sapphire-crystal smartwatch with continuous health sensing and a battery that lasts a full week.',
    specs: { 'Display': '1.4" AMOLED, sapphire glass', 'Battery': 'Up to 7 days', 'Sensors': 'HR, SpO2, temp, GPS', 'Weather rating': '5ATM' },
    variants: { Band: ['Brass Mesh', 'Black Silicone', 'Ceramic White'], Size: ['41mm', '45mm'] }
  },
  {
    id: 'p3', name: 'Aether Field Speaker', category: 'Home', type: 'speaker', seed: 3,
    price: 1899000, discountPrice: 1599000, rating: 4.7, reviews: 98, stock: 41,
    badge: null,
    description: 'A compact broadcast speaker with dual passive radiators and 14 hours of portable playback.',
    specs: { 'Output': '30W peak', 'Battery': '14 hours', 'Connectivity': 'Bluetooth 5.2, USB-C', 'Weather rating': 'IP67' },
    variants: { Color: ['Titanium', 'Sand'] }
  },
  {
    id: 'p4', name: 'Aether Halo Headphones', category: 'Audio', type: 'headphones', seed: 4,
    price: 3599000, discountPrice: null, rating: 4.9, reviews: 176, stock: 12,
    badge: 'Best Seller',
    description: 'Over-ear headphones with a forged aluminum headband and studio-grade active noise cancellation.',
    specs: { 'Driver': '40mm bio-cellulose', 'Battery': '38 hours ANC on', 'Connectivity': 'Bluetooth 5.3, 3.5mm', 'Weight': '246g' },
    variants: { Color: ['Graphite', 'Ceramic White'] }
  },
  {
    id: 'p5', name: 'Aether Pulse Tracker', category: 'Wearable', type: 'tracker', seed: 5,
    price: 1299000, discountPrice: null, rating: 4.4, reviews: 61, stock: 54,
    badge: null,
    description: 'A featherweight fitness band with seven-day battery life and sleep-stage tracking.',
    specs: { 'Display': 'Always-on mono OLED', 'Battery': '9 days', 'Sensors': 'HR, SpO2, accelerometer', 'Weather rating': 'IPX8' },
    variants: { Color: ['Black', 'Sand', 'Sapphire'] }
  },
  {
    id: 'p6', name: 'Aether Loop Charge Case', category: 'Audio', type: 'chargeCase', seed: 6,
    price: 599000, discountPrice: null, rating: 4.5, reviews: 40, stock: 76,
    badge: null,
    description: 'A wireless charging case with USB-C fast charge, compatible with the full Loop earbuds range.',
    specs: { 'Charging': 'Qi wireless + USB-C', 'Capacity': '650mAh', 'Compatibility': 'Aether Loop series' },
    variants: { Color: ['Titanium', 'Graphite'] }
  },
  {
    id: 'p7', name: 'Aether Loop Pro Earbuds', category: 'Audio', type: 'earbuds', seed: 7,
    price: 3199000, discountPrice: 2799000, rating: 4.9, reviews: 289, stock: 9,
    badge: 'Best Seller',
    description: 'The flagship Loop with dual-driver architecture and industry-leading noise cancellation depth.',
    specs: { 'Driver': 'Dual: 11mm + balanced armature', 'Battery': '10h + 30h case', 'Connectivity': 'Bluetooth 5.3, LE Audio', 'Weather rating': 'IPX5' },
    variants: { Color: ['Titanium', 'Graphite'] }
  },
  {
    id: 'p8', name: 'Aether Cove Speaker', category: 'Home', type: 'speaker', seed: 8,
    price: 2999000, discountPrice: null, rating: 4.3, reviews: 27, stock: 4,
    badge: null,
    description: 'A home broadcast speaker with room-sensing acoustics and multi-room grouping.',
    specs: { 'Output': '60W peak', 'Connectivity': 'Wi-Fi, Bluetooth 5.2', 'Voice assistant': 'Supported', 'Power': 'Mains-powered' },
    variants: { Color: ['Titanium', 'Ceramic White'] }
  },
  {
    id: 'p9', name: 'Aether Ring Watch SE', category: 'Wearable', type: 'watch', seed: 9,
    price: 2799000, discountPrice: 2399000, rating: 4.5, reviews: 84, stock: 22,
    badge: null,
    description: 'The essential edition of Ring Watch — same sensors, aluminum case, silicone band.',
    specs: { 'Display': '1.3" AMOLED', 'Battery': 'Up to 6 days', 'Sensors': 'HR, SpO2, GPS', 'Weather rating': '5ATM' },
    variants: { Band: ['Black Silicone', 'Sand Silicone'], Size: ['41mm'] }
  }
];

export function findProduct(id) {
  return products.find((p) => p.id === id) || null;
}

export function formatIDR(n) {
  return 'Rp' + Math.round(n).toLocaleString('id-ID');
}

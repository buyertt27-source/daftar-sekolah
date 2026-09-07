// Portfolio — design case studies behind Aether's own product line.

export const portfolio = [
  {
    id: 'w1', title: 'Loop: acoustic chamber redesign', category: 'Acoustic Engineering', year: 2025, seed: 0,
    featured: true,
    description: 'Rebuilding the internal driver chamber of our flagship earbud to widen the soundstage without adding size — six prototype rounds, from 3D-printed shells to final titanium tooling.',
    tech: ['Acoustics', 'CAD', 'Rapid Prototyping']
  },
  {
    id: 'w2', title: 'Ring Watch sensor fusion', category: 'Wearable Systems', year: 2025, seed: 1,
    description: 'Combining five biometric sensors into a 9mm-thick case without sacrificing seven-day battery life.',
    tech: ['Embedded Systems', 'Sensor Fusion', 'Power Design']
  },
  {
    id: 'w3', title: 'Field Speaker material study', category: 'Industrial Design', year: 2024, seed: 2,
    description: 'A study in recycled aluminum and weather-sealed textile grilles, built to survive a full season outdoors.',
    tech: ['Materials', 'CMF', 'Weatherproofing']
  },
  {
    id: 'w4', title: 'Halo ANC tuning', category: 'Acoustic Engineering', year: 2024, seed: 3,
    description: 'Six weeks of anechoic-chamber tuning to push active noise cancellation depth without changing driver cost.',
    tech: ['DSP', 'Acoustics', 'Firmware']
  },
  {
    id: 'w5', title: 'Aether companion app', category: 'Product Design', year: 2024, seed: 4,
    description: 'Redesigning the companion app around a single equalizer gesture, cutting setup time from nine steps to three.',
    tech: ['UX Research', 'Interaction Design', 'Prototyping']
  },
  {
    id: 'w6', title: 'Pulse Tracker sleep model', category: 'Data & Firmware', year: 2023, seed: 5,
    description: 'A lightweight on-device sleep-stage model that runs for nine days on a coin-cell-class battery budget.',
    tech: ['Firmware', 'Signal Processing', 'Battery Design']
  },
  {
    id: 'w7', title: 'Charge Case coil layout', category: 'Hardware Engineering', year: 2023, seed: 6,
    description: 'Reworking coil geometry to cut wireless charging time by 40% inside the same case footprint.',
    tech: ['Electromagnetics', 'PCB Design']
  }
];

export function findWork(id) {
  return portfolio.find((w) => w.id === id) || null;
}

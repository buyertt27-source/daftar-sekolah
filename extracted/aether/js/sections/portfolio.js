import { portfolio, findWork } from '../data/portfolio.js';
import { portfolioArt } from '../utils/visual-art.js';
import { attachTilt, observeReveal } from '../components/ui.js';

export function renderPortfolio(openDetail) {
  const grid = document.getElementById('portfolio-grid');
  if (!grid) return;

  grid.innerHTML = portfolio.map((w) => `
    <article class="work-card${w.featured ? ' featured' : ''}" data-id="${w.id}" tabindex="0" role="button" aria-label="View case study: ${w.title}">
      <div class="work-visual">${portfolioArt(w.seed)}</div>
      <div class="work-meta">
        <div class="row"><span>${w.category}</span><span>${w.year}</span></div>
        <h3>${w.title}</h3>
        <p>${w.description}</p>
        <div class="tech-tags">${w.tech.map((t) => `<span class="tech-tag">${t}</span>`).join('')}</div>
        <span class="work-link">View case study</span>
      </div>
    </article>
  `).join('');

  grid.querySelectorAll('.work-card').forEach((card) => {
    attachTilt(card, 5);
    card.addEventListener('click', () => openDetail(card.dataset.id));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDetail(card.dataset.id); }
    });
  });

  observeReveal('#portfolio-grid .work-card');
}

export function workDetailHTML(id) {
  const w = findWork(id);
  if (!w) return '<p style="padding:2rem">Case study not found.</p>';
  return `
    <div class="detail-grid">
      <div class="detail-visual">${portfolioArt(w.seed)}</div>
      <div class="detail-body">
        <div class="detail-meta-row"><span>${w.category}</span><span>${w.year}</span></div>
        <h2>${w.title}</h2>
        <p>${w.description}</p>
        <div class="tech-tags" style="margin-top:1rem">${w.tech.map((t) => `<span class="tech-tag">${t}</span>`).join('')}</div>
      </div>
    </div>
  `;
}

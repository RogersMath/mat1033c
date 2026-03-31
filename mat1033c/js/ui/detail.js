// =============================================================
// detail.js — Formula Detail Page Rendering + Navigation
// Part of MAT1033c SLC Survival Guide (CourseMesh Architecture)
// =============================================================

import { DETAIL_ANIM_DURATION } from '../config.js';
import { qs, createEl } from '../utils.js';
import { loadFormula } from '../loader.js';
import { closeFormulaDetail } from '../engine.js';

// =============================================================
// Initialize Detail Page Handlers
// Called from render.js AFTER DOM is ready
// =============================================================
export function initDetailHandlers() {
  // Back button inside the detail panel
  window.addEventListener('click', (e) => {
    const backBtn = e.target.closest('.detail-back-btn');
    if (backBtn) {
      closeFormulaDetail();
    }
  });

  // Global event: request open (from gestures or card click)
  window.addEventListener('openFormulaRequested', async (e) => {
    const { id } = e.detail;
    const formula = await loadFormula(id);
    renderDetailPage(formula);
  });

  // User pressed escape → close detail page
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeFormulaDetail();
    }
  });
}

// =============================================================
// Render Full Detail Page for Formula JSON
// =============================================================
export function renderDetailPage(formulaData) {
  const detail = qs('.formula-detail');
  if (!detail) return;

  const inner = detail.querySelector('.detail-inner');
  inner.innerHTML = '';  // clear previous content

  // -----------------------------
  // Title
  // -----------------------------
  const title = createEl('h2', { class: 'detail-title' });
  title.textContent = formulaData.title;
  inner.appendChild(title);

  // -----------------------------
  // Main Formula (MathJax)
  // -----------------------------
  const formulaBlock = createEl('div', { class: 'detail-section latex-block' });
  formulaBlock.innerHTML = `$$${formulaData.latex || ''}$$`;
  inner.appendChild(formulaBlock);

  // -----------------------------
  // Notes
  // -----------------------------
  if (formulaData.notes && formulaData.notes.length > 0) {
    const notesSec = createEl('div', { class: 'detail-section' });
    const h = createEl('h3');
    h.textContent = 'Notes';
    notesSec.appendChild(h);

    formulaData.notes.forEach(n => {
      const p = createEl('p');
      p.textContent = n;
      notesSec.appendChild(p);
    });

    inner.appendChild(notesSec);
  }

  // -----------------------------
  // Worked Examples
  // -----------------------------
  if (formulaData.examples && formulaData.examples.length > 0) {
    const exSec = createEl('div', { class: 'detail-section' });
    const h = createEl('h3');
    h.textContent = 'Worked Examples';
    exSec.appendChild(h);

    formulaData.examples.forEach(ex => {
      const desc = createEl('p');
      desc.textContent = ex.description || '';
      exSec.appendChild(desc);

      if (ex.latex) {
        const block = createEl('div');
        block.innerHTML = `$$${ex.latex}$$`;
        exSec.appendChild(block);
      }
    });

    inner.appendChild(exSec);
  }

  // -----------------------------
  // Applications
  // -----------------------------
  if (formulaData.applications && formulaData.applications.length > 0) {
    const appSec = createEl('div', { class: 'detail-section' });
    const h = createEl('h3');
    h.textContent = 'Applications';
    appSec.appendChild(h);

    formulaData.applications.forEach(a => {
      const p = createEl('p');
      p.textContent = a;
      appSec.appendChild(p);
    });

    inner.appendChild(appSec);
  }

  // -----------------------------
  // Prerequisites (links to other formulas)
  // -----------------------------
  if (formulaData.prerequisites && formulaData.prerequisites.length > 0) {
    const preSec = createEl('div', { class: 'detail-section' });
    const h = createEl('h3');
    h.textContent = 'Prerequisites';
    preSec.appendChild(h);

    formulaData.prerequisites.forEach(id => {
      const btn = createEl('button', {
        class: 'detail-link-btn',
        'data-id': id
      });
      btn.textContent = id;

      btn.addEventListener('click', async () => {
        const f = await loadFormula(id);
        renderDetailPage(f);
        window.location.hash = `#/${id}`;
      });

      preSec.appendChild(btn);
    });

    inner.appendChild(preSec);
  }

  // -----------------------------
  // Related Formulas (links)
  // -----------------------------
  if (formulaData.related && formulaData.related.length > 0) {
    const relSec = createEl('div', { class: 'detail-section' });
    const h = createEl('h3');
    h.textContent = 'Related Concepts';
    relSec.appendChild(h);

    formulaData.related.forEach(id => {
      const btn = createEl('button', {
        class: 'detail-link-btn',
        'data-id': id
      });
      btn.textContent = id;

      btn.addEventListener('click', async () => {
        const f = await loadFormula(id);
        renderDetailPage(f);
        window.location.hash = `#/${id}`;
      });

      relSec.appendChild(btn);
    });

    inner.appendChild(relSec);
  }

  // -----------------------------
  // Video Link (Khan or others)
  // -----------------------------
  if (formulaData.video) {
    const vidSec = createEl('div', { class: 'detail-section' });
    const h = createEl('h3');
    h.textContent = 'Video Explanation';
    vidSec.appendChild(h);

    const a = createEl('a', {
      href: formulaData.video,
      target: '_blank',
      rel: 'noopener'
    });
    a.textContent = 'Watch Video';
    vidSec.appendChild(a);

    inner.appendChild(vidSec);
  }

  // -----------------------------
  // Activate Slide-Left Panel
  // -----------------------------
  detail.classList.add('active');

  detail.style.transition = `left ${DETAIL_ANIM_DURATION}ms ease, transform ${DETAIL_ANIM_DURATION}ms ease`;

  // -----------------------------
  // Trigger MathJax Typesetting
  // -----------------------------
  if (window.MathJax && window.MathJax.typeset) {
    window.MathJax.typeset();
  }
}
// =============================================================
// render.js — DOM Rendering for Sections + Formula Cards
// Part of MAT1033c SLC Survival Guide (CourseMesh Architecture)
// =============================================================

import { qs, createEl } from '../utils.js';
import { initGestureHandlers } from './gestures.js';
import { initMenuHandlers } from './menu.js';
import { initSwipeHandlers } from './swipe.js';
import { initDetailHandlers } from './detail.js';

// =============================================================
// INIT RENDERING
// Called once from engine.js, after course.json is loaded
// =============================================================
export function initRender(AppState) {
  renderSections(AppState);
  renderMenuLinks(AppState);

  // Initialize UI subsystems AFTER DOM exists
  initGestureHandlers();
  initMenuHandlers(AppState);
  initSwipeHandlers();
  initDetailHandlers();
}

// =============================================================
// RENDER ALL SECTIONS INTO <main>
// =============================================================
function renderSections(AppState) {
  const { course } = AppState;
  const main = qs('main');
  main.innerHTML = ''; // Clear previous content (safe on first load)

  course.sections.forEach((sec, index) => {
    const sectionEl = createEl('section', {
      class: `section${index === 0 ? ' active' : ''}`,
      id: sec.id
    });

    // Section Title (supports future i18n)
    const title = createEl('h2', { class: 'family-title' });
    title.textContent = sec.title;
    sectionEl.appendChild(title);

    // Grid container
    const grid = createEl('div', { class: 'formula-grid' });

    sec.formulas.forEach(formulaId => {
      const card = createFormulaCard(formulaId);
      grid.appendChild(card);
    });

    sectionEl.appendChild(grid);
    main.appendChild(sectionEl);
  });
}

// =============================================================
// RENDER MENU LINKS INTO #sidemenu (side navigation)
// =============================================================
function renderMenuLinks(AppState) {
  const menu = qs('#sidemenu');
  menu.innerHTML = ''; // Wipe previous in case of reload

  AppState.course.sections.forEach(sec => {
    const link = createEl('a', {
      class: 'menu-link',
      href: '#',
      'data-target': sec.id
    });
    link.textContent = sec.title;
    menu.appendChild(link);
  });
}

// =============================================================
// CREATE A FORMULA CARD (minimal info — details loaded lazily)
// =============================================================
function createFormulaCard(formulaId) {
  const card = createEl('div', {
    class: 'formula-card',
    'data-id': formulaId
  });

  // Golden treasure reveal layer (width updated in gestures.js)
  const reveal = createEl('div', { class: 'reveal-layer' });
  card.appendChild(reveal);

  // Placeholder title (actual title loaded upon detail open)
  const title = createEl('h3', { class: 'formula-title' });
  title.textContent = formulaId; // Temporary text
  card.appendChild(title);

  // Desktop click → open detail page immediately
  card.addEventListener('click', () => {
    // Drag handling in gestures.js will block mis‑clicks
    window.dispatchEvent(new CustomEvent('openFormulaRequested', {
      detail: { id: formulaId }
    }));
  });

  return card;
}
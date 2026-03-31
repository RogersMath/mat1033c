// =============================================================
// router.js — Hash-Based Navigation + Deep Linking
// Part of MAT1033c SLC Survival Guide (CourseMesh Architecture)
// =============================================================

import { openFormulaDetail, closeFormulaDetail, activateSection } from './engine.js';
import { loadFormula } from './loader.js';
import { qs } from './utils.js';

// =============================================================
// Initialize Router
// Called from engine.js AFTER initRender()
// =============================================================
export function initRouter(AppState) {

  // Interpret initial hash
  handleHashChange(AppState);

  // Update on user navigation (back/forward)
  window.addEventListener('hashchange', () => handleHashChange(AppState));

  // Listen for section navigation events
  window.addEventListener('sectionNavigate', (e) => {
    const { direction, index } = e.detail;

    if (direction === 'index') {
      activateSection(index);
      return;
    }

    if (direction === 'next') {
      const next = AppState.currentSectionIndex + 1;
      activateSection(next);
      return;
    }

    if (direction === 'previous') {
      const prev = AppState.currentSectionIndex - 1;
      activateSection(prev);
      return;
    }
  });
}

// =============================================================
// Interpret the hash in the URL
// #/slope         → open formula detail
// #/              → close detail
// (no hash)       → default section 0
// =============================================================
async function handleHashChange(AppState) {
  const hash = window.location.hash;

  // No hash → close detail + show section 0
  if (!hash || hash === '#' || hash === '#/') {
    closeFormulaDetail();
    activateSection(0);
    return;
  }

  // Expecting format "#/<formulaID>"
  if (hash.startsWith('#/')) {
    const formulaId = hash.replace('#/', '').trim();

    if (!formulaId) {
      closeFormulaDetail();
      return;
    }

    // Lazy-load the formula and open detail
    const formula = await loadFormula(formulaId);
    if (formula) {
      openFormulaDetail(formulaId);
      return;
    }

    // If formula not found: graceful fallback
    closeFormulaDetail();
    activateSection(0);
  }
}
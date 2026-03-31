// =============================================================
// engine.js — Core Orchestrator for the Formula Learning Platform
// ES Module — Do Not Add Heavy Logic Here
// =============================================================

// Import helper modules (all pure ES modules)
import { loadCourse, loadFormula, loadTranslations, initCache } from './loader.js';
import { initUI, bindSwipeHandlers, bindMenuHandlers, initDetailPage } from './ui.js';
import { initRouter, navigateToFormulaFromHash } from './router.js';
import { setLanguage, getLanguage, applyTranslations } from './i18n.js';
import { buildPrerequisiteGraph } from './graph.js';
import { qs } from './utils.js';

// App state (lightweight global, safe inside module scope)
export const AppState = {
  course: null,
  sections: [],
  formulas: {},             // all loaded formulas
  prerendered: false,       // safety flag
  graph: null,              // prerequisite graph
  currentSectionIndex: 0,
  currentDetail: null,
  language: 'en'
};

// =============================================================
// STEP 1: Initialize Application
// =============================================================
export async function initApp() {
  try {
    // 1. Init cache structures
    initCache();

    // 2. Load language from localStorage or default to English
    const lang = getLanguage() || 'en';
    AppState.language = lang;
    await loadTranslations(lang);

    // 3. Load course structure from course.json
    AppState.course = await loadCourse();

    // 4. Build knowledge graph from formula metadata
    AppState.graph = buildPrerequisiteGraph(AppState.course);

    // 5. Initialize UI (menu, layout, detail page shell)
    initUI(AppState);

    // 6. Bind swipe gestures + hamburger menu
    bindSwipeHandlers(AppState);
    bindMenuHandlers(AppState);
    initDetailPage(AppState);

    // 7. Initialize router (hash-based navigation)
    initRouter(AppState);

    // Apply translations to static UI parts
    applyTranslations(AppState.language);

    // 8. Render initial screen (handle deep links)
    await startupNavigation();

  } catch (err) {
    console.error("Initialization error:", err);
  }
}

// =============================================================
// STEP 2: Handle Startup Navigation
//     - If hash targets a formula, load detail view immediately
//     - Otherwise, show the first section
// =============================================================
async function startupNavigation() {
  const hash = window.location.hash;

  if (hash && hash.startsWith('#/')) {
    // Attempt direct formula navigation
    const formulaId = hash.replace('#/', '').trim();
    await navigateToFormulaFromHash(AppState, formulaId);
  } else {
    // Default: show first section
    activateSection(0);
  }
}

// =============================================================
// STEP 3: Section Switching Logic (called from ui.js)
// =============================================================
export function activateSection(index) {
  const { sections } = AppState.course;

  if (index < 0 || index >= sections.length) return;
  AppState.currentSectionIndex = index;

  // DOM updates (minimal here)
  document
    .querySelectorAll('.section')
    .forEach((sec) => sec.classList.remove('active'));

  const activeId = sections[index].id;
  const activeEl = qs(`#${activeId}`);
  if (activeEl) activeEl.classList.add('active');
}

// =============================================================
// STEP 4: Formula Detail Navigation (UI delegates to here)
// =============================================================
export async function openFormulaDetail(formulaId) {
  // Lazy load formula if not yet loaded
  if (!AppState.formulas[formulaId]) {
    AppState.formulas[formulaId] = await loadFormula(formulaId);
  }

  AppState.currentDetail = AppState.formulas[formulaId];

  // Update hash for deep linking
  window.location.hash = `#/${formulaId}`;

  // UI will handle animations + rendering
  const detailPage = qs('.formula-detail');
  if (!detailPage) return;

  // Custom event to trigger ui.js rendering
  const evt = new CustomEvent('formulaDetailRequested', {
    detail: AppState.currentDetail
  });
  window.dispatchEvent(evt);
}

// =============================================================
// STEP 5: Close Formula Detail Page
// =============================================================
export function closeFormulaDetail() {
  AppState.currentDetail = null;

  // Remove hash
  history.pushState("", document.title, window.location.pathname);

  const evt = new CustomEvent('formulaDetailClosed');
  window.dispatchEvent(evt);
}

// =============================================================
// STEP 6: Change Language (from i18n.js)
// =============================================================
export async function changeLanguage(lang) {
  AppState.language = lang;
  setLanguage(lang);

  // Reload translations and re-render UI text
  await loadTranslations(lang);
  applyTranslations(lang);

  // Re-render detail page if open
  if (AppState.currentDetail) {
    const evt = new CustomEvent('formulaDetailRequested', {
      detail: AppState.currentDetail
    });
    window.dispatchEvent(evt);
  }
}

// =============================================================
// Ready to export initApp (called from index.html)
// =============================================================
export default {
  initApp,
  activateSection,
  openFormulaDetail,
  closeFormulaDetail,
  changeLanguage
};
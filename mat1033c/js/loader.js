// =============================================================
// loader.js — Loads Course, Formula JSON, and Translations
// Updated for GitHub Pages subfolder structure
// =============================================================

// Base paths NOW include the mat1033c/ subfolder
const COURSE_FILE = './mat1033c/course.json';
const FORMULA_DIR = './mat1033c/formulas/';
const I18N_DIR = './mat1033c/i18n/';

// Caches
let courseCache = null;
let formulaCache = {};
let translationCache = {};

// =============================================================
// Utility: Fetch JSON safely
// =============================================================
async function fetchJSON(url) {
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    return await res.json();
  } catch (err) {
    console.error(`Error loading JSON from ${url}:`, err);
    return null;
  }
}

// =============================================================
// Reset caches (called once from engine.js)
// =============================================================
export function initCache() {
  courseCache = null;
  formulaCache = {};
  translationCache = {};
}

// =============================================================
// Load course.json
// =============================================================
export async function loadCourse() {
  if (courseCache) return courseCache;

  const json = await fetchJSON(COURSE_FILE);
  if (!json) throw new Error("Failed to load course.json");

  validateCourse(json);
  courseCache = json;
  return json;
}

// =============================================================
// Load formula JSON (lazy-load each file)
// =============================================================
export async function loadFormula(id) {
  if (formulaCache[id]) return formulaCache[id];

  const path = `${FORMULA_DIR}${id}.json`;
  const json = await fetchJSON(path);

  if (!json) {
    console.warn(`Formula ${id} not found — placeholder returned.`);
    formulaCache[id] = {
      id,
      title: `Missing formula: ${id}`,
      latex: "",
      notes: ["This formula JSON could not be loaded."],
      examples: [],
      applications: [],
      prerequisites: [],
      related: []
    };
    return formulaCache[id];
  }

  validateFormula(json);
  formulaCache[id] = json;
  return json;
}

// =============================================================
// Load translations for selected language
// =============================================================
export async function loadTranslations(lang) {
  if (translationCache[lang]) return translationCache[lang];

  const path = `${I18N_DIR}${lang}.json`;
  const json = await fetchJSON(path);

  translationCache[lang] = json || {};
  return translationCache[lang];
}

// =============================================================
// Validation (lightweight)
// =============================================================
function validateCourse(json) {
  if (!Array.isArray(json.sections)) {
    console.warn("course.json missing 'sections' array");
  }
}

function validateFormula(json) {
  if (!json.id) console.warn("Formula JSON missing id");
  if (!json.title) console.warn(`Formula ${json.id} missing title`);
  if (!json.latex) console.warn(`Formula ${json.id} missing latex`);
}

// =============================================================
// Get cached data
// =============================================================
export function getCourseMetadata() {
  return courseCache;
}

export function getFormulaCache() {
  return formulaCache;
}

export function getTranslations(lang) {
  return translationCache[lang] || {};
}

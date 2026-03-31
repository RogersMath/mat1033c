// =============================================================
// loader.js — Handles Course + Formula + Translation Loading
// ES Module — Part of the MAT1033c SLC Survival Guide Architecture
// =============================================================

// Caches
let courseCache = null;
let formulaCache = {};
let translationCache = {};

// Base paths (future-proof)
const COURSE_FILE = './course.json';
const FORMULA_DIR = './formulas/';
const I18N_DIR = './i18n/';

// =============================================================
// Utility: Fetch JSON with graceful fallback + validation stub
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
// Initialize Caches (called once by engine.js)
// =============================================================
export function initCache() {
  courseCache = null;
  formulaCache = {};
  translationCache = {};
}

// =============================================================
// Load Course Structure (course.json)
// =============================================================
export async function loadCourse() {
  if (courseCache) return courseCache;

  const json = await fetchJSON(COURSE_FILE);
  if (!json) throw new Error("Failed to load course.json.");

  // Optional validation hook
  validateCourse(json);

  courseCache = json;
  return json;
}

// =============================================================
// Load Formula JSON (lazy-loaded on demand)
// =============================================================
export async function loadFormula(id) {
  if (formulaCache[id]) return formulaCache[id];

  const path = `${FORMULA_DIR}${id}.json`;
  const json = await fetchJSON(path);

  if (!json) {
    console.warn(`Formula ${id} missing; returning placeholder.`);
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

  // Optional validation
  validateFormula(json);

  formulaCache[id] = json;
  return json;
}

// =============================================================
// Load Translation File for a Language
// =============================================================
export async function loadTranslations(lang) {
  if (translationCache[lang]) return translationCache[lang];

  const path = `${I18N_DIR}${lang}.json`;
  const json = await fetchJSON(path);

  if (!json) {
    console.warn(`Missing translation file for lang '${lang}', using empty stub.`);
    translationCache[lang] = {};
  } else {
    translationCache[lang] = json;
  }

  return translationCache[lang];
}

// =============================================================
// Helpers for Validation (lightweight, expand later)
// =============================================================
function validateCourse(json) {
  if (!json.sections || !Array.isArray(json.sections)) {
    console.warn("Course JSON missing 'sections' array.");
  }
  // You may add deeper validation rules here.
}

function validateFormula(json) {
  if (!json.id) console.warn("Formula JSON missing 'id'.");
  if (!json.title) console.warn(`Formula ${json.id} missing 'title'.`);
  if (!json.latex) console.warn(`Formula ${json.id} missing 'latex'.`);
  // Expand with more robust validation as needed.
}

// =============================================================
// Utilities for external modules
// =============================================================
export function getFormulaCache() {
  return formulaCache;
}

export function getTranslations(lang) {
  return translationCache[lang] || {};
}

export function getCourseMetadata() {
  return courseCache;
}
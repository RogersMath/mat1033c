// =============================================================
// i18n.js — Internationalization (EN / ES / HT)
// Part of MAT1033c SLC Survival Guide (CourseMesh Architecture)
// =============================================================

import { loadTranslations } from './loader.js';

let currentLanguage = 'en';
let translations = {};

// =============================================================
// Load a language file and activate it
// =============================================================
export async function setLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem('cm_lang', lang);

  translations = await loadTranslations(lang);
  applyTranslationsToDOM();
  return translations;
}

// =============================================================
// Get active language (fallback to browser or English)
// =============================================================
export function getLanguage() {
  const stored = localStorage.getItem('cm_lang');
  if (stored) return stored;

  // Optional: detect browser language
  const browserLang = navigator.language.slice(0, 2);
  if (['en', 'es', 'ht'].includes(browserLang)) {
    return browserLang;
  }

  return 'en';
}

// =============================================================
// Translate a given key (simple lookup, nested supported)
// Examples:
//    t("menu.title")
//    t("sections.linear")
// =============================================================
export function t(path) {
  const parts = path.split('.');
  let node = translations;

  for (const p of parts) {
    if (!node[p]) return path; // graceful fallback
    node = node[p];
  }

  return node;
}

// =============================================================
// Apply translations to DOM elements
// Elements opt-in with: data-i18n="menu.title"
// =============================================================
export function applyTranslationsToDOM() {
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    const text = t(key);
    el.textContent = text;
  });

  // Re-typeset MathJax if needed
  if (window.MathJax?.typeset) {
    window.MathJax.typeset();
  }
}
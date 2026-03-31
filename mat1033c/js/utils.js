// =============================================================
// utils.js — Shared Utility Functions
// Part of MAT1033c SLC Survival Guide (CourseMesh Architecture)
// =============================================================

// =============================================================
// DOM Helpers
// =============================================================

/**
 * Query selector (single element)
 * @param {string} sel
 * @returns {HTMLElement|null}
 */
export function qs(sel) {
  return document.querySelector(sel);
}

/**
 * Query selector (multiple elements)
 * @param {string} sel
 * @returns {NodeListOf<HTMLElement>}
 */
export function qsa(sel) {
  return document.querySelectorAll(sel);
}

/**
 * Create an element with optional attributes
 * @param {string} tag
 * @param {Object} attrs
 * @returns {HTMLElement}
 */
export function createEl(tag, attrs = {}) {
  const el = document.createElement(tag);
  for (const key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
  return el;
}

// =============================================================
// Math / Animation Helpers
// =============================================================

/**
 * Clamp a number between min/max
 * @param {number} val
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

/**
 * Linear interpolation
 * @param {number} a
 * @param {number} b
 * @param {number} t
 * @returns {number}
 */
export function lerp(a, b, t) {
  return a + (b - a) * t;
}

// =============================================================
// Accessibility / Events
// =============================================================

/**
 * Trap focus inside a container (optional future improvement)
 * @param {HTMLElement} container
 */
export function trapFocus(container) {
  const focusable = container.querySelectorAll(
    'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
  );

  if (focusable.length === 0) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  container.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
}

/**
 * Dispatch a custom event with optional detail payload
 * @param {string} name
 * @param {Object} detail
 */
export function emit(name, detail = {}) {
  const evt = new CustomEvent(name, { detail });
  window.dispatchEvent(evt);
}
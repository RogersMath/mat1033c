// =============================================================
// menu.js — Hamburger Menu + Overlay + Section Navigation
// Part of MAT1033c SLC Survival Guide (CourseMesh Architecture)
// =============================================================

import { qs, qsa } from '../utils.js';

// =============================================================
// Initialize Menu Handlers
// Called once from engine.js
// =============================================================
export function initMenuHandlers(AppState) {
  const menu     = qs('#sidemenu');
  const overlay  = qs('#menuOverlay');
  const hamburger = qs('#hamburger');

  if (!menu || !overlay || !hamburger) {
    console.warn("menu.js: Missing one or more required DOM elements.");
    return;
  }

  // -------------------------------------------------------------
  // OPEN MENU
  // -------------------------------------------------------------
  hamburger.addEventListener('click', () => {
    menu.classList.add('open');
    overlay.classList.add('active');
  });

  // -------------------------------------------------------------
  // CLOSE MENU by overlay click
  // -------------------------------------------------------------
  overlay.addEventListener('click', () => {
    menu.classList.remove('open');
    overlay.classList.remove('active');
  });

  // -------------------------------------------------------------
  // SELECT SECTION FROM MENU LINKS
  // -------------------------------------------------------------
  qsa('.menu-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      const target = link.getAttribute('data-target');

      // Find target index in course.json
      const idx = AppState.course.sections.findIndex(sec => sec.id === target);

      if (idx >= 0) {
        window.dispatchEvent(
          new CustomEvent('sectionNavigate', {
            detail: { direction: 'index', index: idx }
          })
        );
      }

      // Close drawer
      menu.classList.remove('open');
      overlay.classList.remove('active');
    });
  });
}
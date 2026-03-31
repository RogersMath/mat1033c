// =============================================================
// config.js — Centralized UI Configuration for MAT1033c Survival Guide
// =============================================================

// Swipe navigation
export const SWIPE_THRESHOLD = 50;          // px required to trigger section switch

// Treasure reveal
export const DRAG_REVEAL_LIMIT = 120;       // px = full gold reveal
export const DRAG_TRIGGER_RATIO = 0.75;     // 75% of reveal triggers detail page

// Detail page animation
export const DETAIL_ANIM_DURATION = 250;    // ms for slide-left panel

// Gesture smoothing
export const DRAG_EASING = 0.15;            // smoothing coefficient

// Z-index layering
export const Z_DETAIL = 4000;
export const Z_MENU = 3000;
export const Z_OVERLAY = 2500;
export const Z_HEADER = 2000;

// Future-proof hooks for theming
export const THEME = {
  accentGoldStart: '#D4AF37',
  accentGoldEnd:   '#F7E27D',
  goldLight:       'rgba(255, 230, 150, 0.75)'
};
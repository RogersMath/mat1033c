// =============================================================
// gestures.js — Drag-to-Reveal + Drag-to-Open Formula Gestures
// Part of MAT1033c SLC Survival Guide (CourseMesh Architecture)
// =============================================================

import { DRAG_REVEAL_LIMIT, DRAG_TRIGGER_RATIO } from '../config.js';
import { openFormulaDetail } from '../engine.js';
import { qs, qsa, clamp } from '../utils.js';

// Drag state
let dragStartX = 0;
let draggingCard = null;
let revealLayer = null;

// =============================================================
// INIT GESTURE HANDLERS
// Called once from engine.js after UI is rendered
// =============================================================
export function initGestureHandlers() {
  // Touch events
  window.addEventListener('touchstart', handleStart, { passive: true });
  window.addEventListener('touchmove',  handleMove,  { passive: true });
  window.addEventListener('touchend',   handleEnd,   { passive: true });

  // Mouse events (desktop fallback)
  window.addEventListener('mousedown', (e) => handleStart(e));
  window.addEventListener('mousemove', (e) => handleMove(e));
  window.addEventListener('mouseup',   (e) => handleEnd(e));
}

// =============================================================
// START DRAG
// =============================================================
function handleStart(e) {
  const target = (e.touches ? e.touches[0].target : e.target);
  const card = target.closest('.formula-card');
  if (!card) return;

  draggingCard = card;
  revealLayer = card.querySelector('.reveal-layer');

  dragStartX = e.touches ?
    e.touches[0].clientX :
    e.clientX;
}

// =============================================================
// DRAG MOVEMENT HANDLER
// =============================================================
function handleMove(e) {
  if (!draggingCard) return;

  const x = e.touches ?
    e.touches[0].clientX :
    e.clientX;

  const dx = clamp(x - dragStartX, 0, DRAG_REVEAL_LIMIT);

  if (revealLayer) {
    const pct = (dx / DRAG_REVEAL_LIMIT) * 100;
    revealLayer.style.width = `${pct}%`;
  }
}

// =============================================================
// DRAG END — Trigger open if dragged far enough
// =============================================================
function handleEnd(e) {
  if (!draggingCard) return;

  const x = e.changedTouches ?
    e.changedTouches[0].clientX :
    e.clientX;

  const dx = x - dragStartX;
  const id = draggingCard.getAttribute('data-id');

  // Trigger detail if dragged sufficiently
  if (dx > DRAG_REVEAL_LIMIT * DRAG_TRIGGER_RATIO) {
    openFormulaDetail(id);
  }

  // Reset reveal animation
  if (revealLayer) {
    revealLayer.style.width = '0%';
  }

  draggingCard = null;
  revealLayer = null;
}
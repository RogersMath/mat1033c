// =============================================================
// swipe.js — Section Swipe Navigation (Left/Right)
// Part of MAT1033c SLC Survival Guide (CourseMesh Architecture)
// =============================================================

import { SWIPE_THRESHOLD } from '../config.js';

// Track touch start
let swipeStartX = 0;

// =============================================================
// INIT SWIPE HANDLERS
// Called once from engine.js during init
// =============================================================
export function initSwipeHandlers() {

  // TOUCH EVENTS
  window.addEventListener('touchstart', (e) => {
    swipeStartX = e.touches[0].clientX;
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    const endX = e.changedTouches[0].clientX;
    handleSwipe(endX - swipeStartX);
  }, { passive: true });


  // DESKTOP MOUSE SWIPE (optional, non-invasive)
  let mouseDownX = null;

  window.addEventListener('mousedown', (e) => {
    mouseDownX = e.clientX;
  });

  window.addEventListener('mouseup', (e) => {
    if (mouseDownX !== null) {
      const dx = e.clientX - mouseDownX;
      handleSwipe(dx);
      mouseDownX = null;
    }
  });
}

// =============================================================
// HANDLE SWIPE DISTANCE
// Negative = swipe left
// Positive = swipe right
// =============================================================
function handleSwipe(dx) {

  // Left swipe → next section
  if (dx < -SWIPE_THRESHOLD) {
    const evt = new CustomEvent('sectionNavigate', {
      detail: { direction: 'next' }
    });
    window.dispatchEvent(evt);
  }

  // Right swipe → previous section
  else if (dx > SWIPE_THRESHOLD) {
    const evt = new CustomEvent('sectionNavigate', {
      detail: { direction: 'previous' }
    });
    window.dispatchEvent(evt);
  }
}
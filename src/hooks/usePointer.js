import { useSyncExternalStore } from "react";

// One module-level pointer store shared by every subscriber (backdrop, trail,
// cards), fed by a single rAF-throttled pointermove listener.
let state = { x: 0, y: 0, nx: 0.5, ny: 0.5, fine: false, ready: false };
const listeners = new Set();
let pending = null;
let raf = null;
let started = false;

function broadcast() {
  state = pending;
  pending = null;
  listeners.forEach((l) => l());
}

function start() {
  if (started || typeof window === "undefined") return;
  started = true;
  state = {
    ...state,
    fine: window.matchMedia("(hover: hover) and (pointer: fine)").matches,
  };
  const onMove = (e) => {
    pending = {
      ...state,
      x: e.clientX,
      y: e.clientY,
      nx: e.clientX / window.innerWidth,
      ny: e.clientY / window.innerHeight,
      ready: true,
    };
    if (raf === null) {
      raf = requestAnimationFrame(() => {
        raf = null;
        broadcast();
      });
    }
  };
  window.addEventListener("pointermove", onMove, { passive: true });
}

function subscribe(cb) {
  start();
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/** Shared pointer position: { x, y, nx, ny } (nx/ny are 0..1 viewport
 *  fractions), `fine` = desktop pointer, `ready` = has moved at least once. */
export function usePointer() {
  return useSyncExternalStore(subscribe, () => state);
}

/**
 * Shared motion language. Components reference these instead of inline numbers,
 * so the whole site keeps one rhythm.
 */
export const EASE = {
  out: 'expo.out',
  soft: 'power3.out',
  inOut: 'power2.inOut',
  in: 'power2.in',
}

export const DURATION = {
  fast: 0.35,
  base: 0.8,
  slow: 1.2,
  cinematic: 1.8,
}

export const STAGGER = {
  lines: 0.08,
  words: 0.03,
  items: 0.06,
}

/** Lenis tuning — light smoothing so scrolling stays responsive. */
export const SCROLL = {
  lerp: 0.12,
  wheelMultiplier: 1,
  touchMultiplier: 1.2,
}

/** Frame-based damping factors (THREE.MathUtils.damp lambda: higher = snappier). */
export const DAMP = {
  camera: 3.2,
  cameraReduced: 8,
  pointer: 2.4,
  object: 4,
  stage: 5,
}

/** Pointer parallax amplitude in world units / radians. Intentionally small. */
export const PARALLAX = {
  cameraShift: 0.35,
  objectTilt: 0.12,
  light: 1.5,
}

/** Intro choreography (seconds). Never held longer than asset readiness requires. */
export const INTRO = {
  formDuration: 2.1,
  holdAfterForm: 0.35,
  revealDuration: 1.6,
  reducedDuration: 0.4,
}

/** Page transition cover timings (seconds). */
export const TRANSITION = {
  cover: 0.7,
  reveal: 0.8,
}

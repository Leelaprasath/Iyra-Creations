export const clamp = (v, min = 0, max = 1) => (v < min ? min : v > max ? max : v)
export const lerp = (a, b, t) => a + (b - a) * t

/** Maps p from [start, end] to [0, 1], clamped. Used to split scroll progress into stages. */
export const range = (p, start, end) => clamp((p - start) / (end - start))

export const smoothstep = (t) => t * t * (3 - 2 * t)
export const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)
export const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

/** Snap progress to discrete stages (used for reduced motion). */
export const quantize = (p, steps) => Math.round(p * steps) / steps

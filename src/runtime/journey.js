/**
 * Pure scroll → journey math (unit tested).
 *
 * Every tracked section has a "plateau": the scroll range where it is the
 * focused scene. Tall (sticky) sections plateau for their pinned duration;
 * short sections plateau at the single point where they are centred.
 * Between plateaus the journey value moves linearly from i to i + 1.
 */
export function plateau(top, height, vh) {
  if (height <= vh) {
    const centred = top + (height - vh) / 2
    return [centred, centred]
  }
  return [top, top + height - vh]
}

/** Returns a fractional position in the `metrics` array (0 … n-1). */
export function computeJourney(metrics, scroll) {
  const n = metrics.length
  if (n === 0) return 0
  if (scroll <= metrics[0].start) return 0
  for (let i = 0; i < n; i++) {
    const m = metrics[i]
    if (scroll <= m.end) {
      if (scroll >= m.start) return i
      const prev = metrics[i - 1]
      const span = m.start - prev.end
      return span > 0 ? i - 1 + (scroll - prev.end) / span : i
    }
  }
  return n - 1
}

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)

/** 0 when the section's top reaches the viewport bottom, 1 when its bottom leaves the top. */
export function viewProgress(top, height, vh, scroll) {
  return clamp01((scroll + vh - top) / (height + vh))
}

/** 0 → 1 while a tall section is pinned (sticky). Short sections fall back to view progress. */
export function pinProgress(top, height, vh, scroll) {
  const range = height - vh
  if (range <= 1) return viewProgress(top, height, vh, scroll)
  return clamp01((scroll - top) / range)
}

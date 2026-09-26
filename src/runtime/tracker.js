import { SCENE_INDEX } from '../config/scenes'
import { computeJourney, pinProgress, plateau, viewProgress } from './journey'

/**
 * Single source of scroll truth for both WebGL and DOM.
 * Updated once per GSAP tick (see runtime/smoothScroll.js). Mutable and
 * non-reactive on purpose: 3D reads it inside useFrame, DOM consumers
 * subscribe and write styles directly.
 */
export const tracker = {
  scroll: 0,
  vh: typeof window !== 'undefined' ? window.innerHeight : 800,
  /** Fractional scene index from config/scenes.js. */
  journey: 0,
  /** id → { pin, view } for every [data-scene] / [data-track] element. */
  sections: new Map(),
}

let journeyMetrics = []
let allMetrics = []
const subscribers = new Map()
let measureQueued = false
const EMPTY = { pin: 0, view: 0 }

export function measure() {
  measureQueued = false
  if (typeof document === 'undefined') return
  const vh = window.innerHeight
  const scrollY = window.scrollY
  const metrics = []
  document.querySelectorAll('[data-scene], [data-track]').forEach((el) => {
    const id = el.dataset.scene || el.dataset.track
    const rect = el.getBoundingClientRect()
    const top = rect.top + scrollY
    const [start, end] = plateau(top, rect.height, vh)
    metrics.push({
      id,
      index: el.dataset.scene ? SCENE_INDEX[id] : undefined,
      top,
      height: rect.height,
      start,
      end,
    })
    if (!tracker.sections.has(id)) tracker.sections.set(id, { pin: 0, view: 0 })
  })
  allMetrics = metrics
  journeyMetrics = metrics.filter((m) => m.index !== undefined).sort((a, b) => a.top - b.top)
  tracker.vh = vh
  update(scrollY, true)
}

export function requestMeasure() {
  if (measureQueued) return
  measureQueued = true
  requestAnimationFrame(measure)
}

export function update(scroll, force = false) {
  if (!force && scroll === tracker.scroll) return
  tracker.scroll = scroll
  const { vh } = tracker

  // Map the DOM-order position onto config scene indices so a missing
  // section never shifts later scenes.
  const j = computeJourney(journeyMetrics, scroll)
  const lo = Math.floor(j)
  const a = journeyMetrics[lo]
  const b = journeyMetrics[Math.min(lo + 1, journeyMetrics.length - 1)]
  tracker.journey = a ? a.index + (j - lo) * (b.index - a.index) : 0

  for (const m of allMetrics) {
    const s = tracker.sections.get(m.id)
    const pin = pinProgress(m.top, m.height, vh, scroll)
    const view = viewProgress(m.top, m.height, vh, scroll)
    if (!force && s.pin === pin && s.view === view) continue
    s.pin = pin
    s.view = view
    subscribers.get(m.id)?.forEach((cb) => cb(s))
  }
}

/** Subscribe DOM code to a section's { pin, view }. Returns an unsubscribe fn. */
export function subscribe(id, cb) {
  if (!subscribers.has(id)) subscribers.set(id, new Set())
  subscribers.get(id).add(cb)
  const current = tracker.sections.get(id)
  if (current) cb(current)
  return () => subscribers.get(id)?.delete(cb)
}

export function getSection(id) {
  return tracker.sections.get(id) ?? EMPTY
}

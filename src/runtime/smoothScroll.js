import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { SCROLL } from '../config/motion'
import { measure, tracker, update } from './tracker'

gsap.registerPlugin(ScrollTrigger)

let lenis = null
let locked = false

/**
 * The only scroll loop in the app. GSAP's ticker drives Lenis, then the
 * scroll tracker; the WebGL renderer is advanced from the same ticker
 * (3d/core/Experience.jsx), so everything shares one requestAnimationFrame.
 */
export function startSmoothScroll({ smooth }) {
  if (smooth) {
    lenis = new Lenis({
      autoRaf: false,
      lerp: SCROLL.lerp,
      wheelMultiplier: SCROLL.wheelMultiplier,
      touchMultiplier: SCROLL.touchMultiplier,
    })
    lenis.on('scroll', ScrollTrigger.update)
    // A lock requested before Lenis existed (e.g. by the loader) still applies.
    if (locked) lenis.stop()
  }

  const tick = (time) => {
    if (lenis) lenis.raf(time * 1000)
    update(lenis ? lenis.scroll : window.scrollY)
  }
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)

  // Section metrics are re-measured whenever ScrollTrigger refreshes
  // (resize, font load, layout change detected below).
  ScrollTrigger.addEventListener('refresh', measure)
  let refreshTimer = 0
  const ro = new ResizeObserver(() => {
    clearTimeout(refreshTimer)
    refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 120)
  })
  ro.observe(document.body)
  measure()
  // QA hook: ?debug exposes the scroll state for automated browser checks.
  if (new URLSearchParams(window.location.search).has('debug')) window.__iyra = { tracker }

  return () => {
    gsap.ticker.remove(tick)
    ScrollTrigger.removeEventListener('refresh', measure)
    ro.disconnect()
    clearTimeout(refreshTimer)
    lenis?.destroy()
    lenis = null
  }
}

/** Scroll to an element, selector or pixel offset, respecting reduced motion. */
export function scrollToTarget(target, { immediate = false, offset = 0 } = {}) {
  if (lenis) {
    lenis.scrollTo(target, { offset, immediate, duration: immediate ? 0 : 1.4 })
    return
  }
  const el = typeof target === 'string' ? document.querySelector(target) : target
  const top = typeof target === 'number' ? target : el ? el.getBoundingClientRect().top + window.scrollY + offset : 0
  window.scrollTo({ top, behavior: immediate ? 'auto' : 'smooth' })
}

export function lockScroll(value) {
  locked = value
  if (lenis) {
    if (value) lenis.stop()
    else lenis.start()
  }
  document.documentElement.style.overflow = value ? 'hidden' : ''
}

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { DURATION, EASE, INTRO } from '../../config/motion'
import { intro } from '../../runtime/intro'
import { lockScroll } from '../../runtime/smoothScroll'
import { useAppStore } from '../../store/useAppStore'
import { Logo } from '../ui/Logo'
import styles from './Loader.module.css'

/** Weights of the real loading milestones. */
const WEIGHTS = { fonts: 0.25, experience: 0.45, firstFrame: 0.3 }
/** If WebGL never reports ready (driver hang), continue anyway — never hold the visitor. */
const READY_TIMEOUT_MS = 9000

function computeProgress(steps, needsWebGL) {
  if (!needsWebGL) return steps.fonts ? 1 : 0
  return Object.entries(WEIGHTS).reduce((sum, [k, w]) => sum + (steps[k] ? w : 0), 0)
}

/**
 * Brand loader + intro director.
 * loading   → shows real progress of fonts, the WebGL chunk and first compiled frame
 * forming   → overlay turns transparent; particles gather into IYRA / CREATIONS (3D)
 * revealing → camera pulls back into the hero; hero + header animate in
 * done      → overlay removed
 * Fallback/reduced motion skip the particle formation.
 */
export function Loader() {
  const root = useRef(null)
  const numberRef = useRef(null)
  const barRef = useRef(null)
  const tlRef = useRef(null)
  const shown = useRef({ value: 0 })
  const [removed, setRemoved] = useState(false)

  const phase = useAppStore((s) => s.introPhase)
  const setPhase = useAppStore((s) => s.setIntroPhase)
  const steps = useAppStore((s) => s.loadSteps)
  const tier = useAppStore((s) => s.tier)
  const reduced = useAppStore((s) => s.reducedMotion)
  const [timedOut, setTimedOut] = useState(false)

  const needsWebGL = tier !== 'fallback'
  const progress = timedOut ? 1 : computeProgress(steps, needsWebGL)

  // Lock scrolling only while the loader actually covers the page.
  useEffect(() => {
    lockScroll(true)
    const t = setTimeout(() => setTimedOut(true), READY_TIMEOUT_MS)
    return () => {
      clearTimeout(t)
      lockScroll(false)
    }
  }, [])

  // Animate the displayed percentage toward real progress (never beyond it).
  useEffect(() => {
    const tween = gsap.to(shown.current, {
      value: progress,
      duration: 0.6,
      ease: 'power2.out',
      onUpdate: () => {
        const v = shown.current.value
        if (numberRef.current) numberRef.current.textContent = `${Math.round(v * 100)}%`
        if (barRef.current) barRef.current.style.transform = `scaleX(${v})`
      },
    })
    return () => tween.kill()
  }, [progress])

  useEffect(() => () => tlRef.current?.kill(), [])

  // Start the intro once everything is actually ready. Runs exactly once; the
  // timeline itself advances the phase, so it must not be torn down by it.
  useEffect(() => {
    if (tlRef.current || progress < 1) return
    const el = root.current
    const simple = !needsWebGL || reduced
    const tl = gsap.timeline({ delay: 0.25 })
    tlRef.current = tl

    tl.to(el.querySelector(`.${styles.brand}`), { autoAlpha: 0, y: -10, duration: 0.5, ease: EASE.in })

    if (simple) {
      intro.form = 1
      intro.reveal = 1
      tl.add(() => {
        setPhase('revealing')
        lockScroll(false)
      })
        .to(el, { autoAlpha: 0, duration: reduced ? INTRO.reducedDuration : DURATION.base })
        .add(() => setPhase('done'))
    } else {
      tl.add(() => setPhase('forming'))
        .to(el.querySelector(`.${styles.backdrop}`), { autoAlpha: 0, duration: 0.8, ease: 'none' }, '<')
        .to(intro, { form: 1, duration: INTRO.formDuration, ease: 'power3.inOut' }, '<')
        .add(() => {
          setPhase('revealing')
          lockScroll(false)
        }, `+=${INTRO.holdAfterForm}`)
        .to(intro, { reveal: 1, duration: INTRO.revealDuration, ease: EASE.inOut })
        .add(() => setPhase('done'), '-=0.4')
    }
  }, [progress, needsWebGL, reduced, setPhase])

  useEffect(() => {
    if (phase !== 'done') return
    const t = setTimeout(() => setRemoved(true), 600)
    return () => clearTimeout(t)
  }, [phase])

  const skip = () => {
    tlRef.current?.kill()
    lockScroll(false)
    setPhase('revealing')
    gsap.to(intro, {
      form: 1,
      reveal: 1,
      duration: 0.6,
      ease: EASE.soft,
      onComplete: () => setPhase('done'),
    })
    gsap.to(root.current, { autoAlpha: 0, duration: 0.4 })
  }

  if (removed) return null

  const intro3D = phase === 'forming' || phase === 'revealing'
  return (
    <div ref={root} className={styles.loader} data-phase={phase}>
      <div className={styles.backdrop} />
      <div className={styles.brand} role="status" aria-live="polite">
        <Logo className={styles.word} height={64} />
        <div className={styles.meter}>
          <span ref={barRef} className={styles.bar} />
        </div>
        <p className={styles.number} ref={numberRef}>
          0%
        </p>
        <span className="visually-hidden">Loading the IYRA Creations experience</span>
      </div>
      {intro3D && (
        <button type="button" className={styles.skip} onClick={skip}>
          Skip intro
        </button>
      )}
    </div>
  )
}

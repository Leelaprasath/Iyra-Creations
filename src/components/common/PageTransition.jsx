import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { TRANSITION, EASE } from '../../config/motion'
import { scrollToTarget } from '../../runtime/smoothScroll'
import { registerTransition } from '../../runtime/transition'
import { useAppStore } from '../../store/useAppStore'
import { BrandLogo } from '../ui/BrandLogo'
import styles from './PageTransition.module.css'

/**
 * Geometry wipe in the IYRA language: a black panel sweeps up led by a thin
 * orange edge, the mark flashes at its centre, then the panel exits upward.
 * Reduced motion: a quick opacity cross-fade.
 */
export function PageTransition() {
  const root = useRef(null)

  useEffect(() => {
    const el = root.current
    const panel = el.querySelector(`.${styles.panel}`)
    const mark = el.querySelector(`.${styles.mark}`)

    return registerTransition((swap) => {
      const reduced = useAppStore.getState().reducedMotion
      const tl = gsap.timeline()
      gsap.set(el, { visibility: 'visible' })

      if (reduced) {
        tl.fromTo(panel, { opacity: 0, yPercent: 0 }, { opacity: 1, duration: 0.2 })
          .add(() => {
            swap()
            scrollToTarget(0, { immediate: true })
          })
          .to(panel, { opacity: 0, duration: 0.25, delay: 0.05 })
      } else {
        tl.fromTo(panel, { yPercent: 100, opacity: 1 }, { yPercent: 0, duration: TRANSITION.cover, ease: EASE.inOut })
          .fromTo(mark, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: EASE.soft }, '-=0.25')
          .add(() => {
            swap()
            scrollToTarget(0, { immediate: true })
          })
          .to(mark, { autoAlpha: 0, y: -20, duration: 0.3, ease: EASE.in }, '+=0.1')
          .to(panel, { yPercent: -100, duration: TRANSITION.reveal, ease: EASE.inOut }, '-=0.1')
      }
      tl.set(el, { visibility: 'hidden' })
    })
  }, [])

  return (
    <div ref={root} className={styles.root} aria-hidden="true">
      <div className={styles.panel}>
        <span className={styles.edge} />
        <span className={styles.mark}>
          <BrandLogo height={96} />
        </span>
      </div>
    </div>
  )
}

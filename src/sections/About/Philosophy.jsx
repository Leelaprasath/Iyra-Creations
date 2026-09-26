import { Fragment, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useAppStore } from '../../store/useAppStore'
import styles from './Philosophy.module.css'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const LINES = [
  ['Design', 'should'],
  ['be', 'felt,'],
  ['not', 'just', 'seen.'],
]

/**
 * A single typographic moment: words brighten one by one as the visitor
 * scrolls, with the last word landing in IYRA orange. Reduced motion shows
 * the finished statement.
 */
export function Philosophy() {
  const ref = useRef(null)
  const reduced = useAppStore((s) => s.reducedMotion)

  useGSAP(
    () => {
      if (reduced) return
      const words = ref.current.querySelectorAll(`.${styles.word}`)
      gsap.fromTo(
        words,
        { opacity: 0.12, yPercent: 12 },
        {
          opacity: 1,
          yPercent: 0,
          ease: 'none',
          stagger: 0.25,
          scrollTrigger: { trigger: ref.current, start: 'top 75%', end: 'center 45%', scrub: 0.6 },
        },
      )
    },
    { scope: ref, dependencies: [reduced], revertOnUpdate: true },
  )

  return (
    <section ref={ref} className={styles.philosophy} data-scene="philosophy" aria-label="Our philosophy">
      <div className="container">
        <p className={styles.statement}>
          {LINES.map((line, i) => (
            <span key={i} className={styles.line}>
              {line.map((w, j) => (
                // The space sits between the inline-block words; inside them it would collapse.
                <Fragment key={w}>
                  {j > 0 && ' '}
                  <span className={`${styles.word} ${w === 'felt,' ? styles.felt : ''}`}>{w}</span>
                </Fragment>
              ))}
            </span>
          ))}
        </p>
      </div>
    </section>
  )
}

import { useRef } from 'react'
import { capabilities } from '../../data/capabilities'
import { useReveal } from '../../hooks/useReveal'
import { useSectionProgress } from '../../hooks/useSectionProgress'
import { scrollToTarget } from '../../runtime/smoothScroll'
import { useAppStore } from '../../store/useAppStore'
import styles from './Capabilities.module.css'

const SCENE = 'capabilities'

/**
 * "Our creative universe": scrolling through the pinned section cycles the
 * active capability; selecting one scrolls to its position. The active index
 * lives in the store so the WebGL core can morph with it.
 */
export function Capabilities() {
  const ref = useRef(null)
  const active = useAppStore((s) => s.activeCapability)
  const setActive = useAppStore((s) => s.setActiveCapability)
  const tier = useAppStore((s) => s.tier)
  useReveal(ref)

  useSectionProgress(SCENE, ({ pin }) => {
    const next = Math.min(capabilities.length - 1, Math.floor(pin * capabilities.length))
    if (next !== useAppStore.getState().activeCapability) setActive(next)
  })

  const select = (i) => {
    const el = ref.current
    const top = el.getBoundingClientRect().top + window.scrollY
    const range = el.offsetHeight - window.innerHeight
    scrollToTarget(top + ((i + 0.5) / capabilities.length) * range)
  }

  const current = capabilities[active]

  return (
    <section ref={ref} id="capabilities" className={styles.section} data-scene={SCENE} aria-labelledby="capabilities-title">
      <div className={styles.sticky}>
        <div className={`container ${styles.grid}`}>
          <div className={styles.text}>
            <p className="label label--accent" data-reveal="fade">
              Capabilities
            </p>
            <h2 id="capabilities-title" className={styles.title} data-reveal="lines">
              Our creative universe
            </h2>
            <ul className={styles.list} data-reveal="fade">
              {capabilities.map((c, i) => (
                <li key={c.id}>
                  <button
                    type="button"
                    className={styles.item}
                    aria-pressed={i === active}
                    onClick={() => select(i)}
                    data-cursor="link"
                  >
                    <span className={styles.dot} aria-hidden="true" />
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
            <p className={styles.detail} aria-live="polite">
              <span className={styles.detailName}>{current.name}</span>
              {current.text}
            </p>
          </div>
          <div className={styles.visual} aria-hidden="true">
            {tier === 'fallback' && (
              <div className={styles.orbit} style={{ '--warmth': current.warmth }}>
                {capabilities.map((c, i) => (
                  <span key={c.id} className={styles.node} data-active={i === active || undefined} style={{ '--i': i }} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

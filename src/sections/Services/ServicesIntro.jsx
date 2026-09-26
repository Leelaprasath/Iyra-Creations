import { useRef } from 'react'
import { services } from '../../data/services'
import { useReveal } from '../../hooks/useReveal'
import styles from './ServicesIntro.module.css'

/** "What we create" — the doorway into the five service chapters. */
export function ServicesIntro() {
  const ref = useRef(null)
  useReveal(ref)

  return (
    <section ref={ref} id="services" className={styles.intro} data-scene="services" aria-labelledby="services-title">
      <div className="container">
        <p className="label label--accent" data-reveal="fade">
          Services
        </p>
        <h2 id="services-title" className={styles.title} data-reveal="lines">
          What we <span className="accent">create</span>
        </h2>
        <ol className={styles.list}>
          {services.map((s) => (
            <li key={s.id} data-reveal="fade">
              <a href={`#${s.anchor}`} className={styles.item} data-cursor="link">
                <span className={styles.num}>{s.index}</span>
                <span className={styles.name}>{s.name}</span>
                <span className={styles.arrow} aria-hidden="true">
                  ↓
                </span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

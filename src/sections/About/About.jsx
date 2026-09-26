import { useRef } from 'react'
import { useReveal } from '../../hooks/useReveal'
import styles from './About.module.css'

const DISCIPLINES = ['Design', 'Development', 'Branding', 'Motion', '3D', 'Storytelling']

/** Editorial studio statement. */
export function About() {
  const ref = useRef(null)
  useReveal(ref)

  return (
    <section ref={ref} id="about" className={styles.about} data-scene="about" aria-labelledby="about-title">
      <div className={`container ${styles.grid}`}>
        <p className="label label--accent" data-reveal="fade">
          About IYRA
        </p>
        <h2 id="about-title" className={styles.title} data-reveal="lines">
          We turn <br />
          ideas into <br />
          <span className="accent">experiences.</span>
        </h2>
        <div className={styles.body}>
          <p className="lead" data-reveal="fade">
            IYRA Creations is a creative technology studio. We work where design, engineering and storytelling meet — so a
            brand, a product and the way it moves are conceived as one thing.
          </p>
          <ul className={styles.disciplines} aria-label="Disciplines">
            {DISCIPLINES.map((d, i) => (
              <li key={d} data-reveal="fade">
                <span className={styles.num}>{String(i + 1).padStart(2, '0')}</span>
                {d}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

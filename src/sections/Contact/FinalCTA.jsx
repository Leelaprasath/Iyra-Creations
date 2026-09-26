import { useRef } from 'react'
import { Button } from '../../components/ui/Button'
import { SITE } from '../../config/site'
import { useReveal } from '../../hooks/useReveal'
import { track } from '../../utils/analytics'
import styles from './FinalCTA.module.css'

/** The destination: the orange light is at its strongest here. */
export function FinalCTA() {
  const ref = useRef(null)
  useReveal(ref)

  return (
    <section ref={ref} className={styles.cta} data-scene="cta" aria-labelledby="cta-title">
      <div className={`container ${styles.inner}`}>
        <p className={styles.kicker} data-reveal="fade">
          Have an idea?
        </p>
        <h2 id="cta-title" className={styles.title} data-reveal="lines">
          Let&apos;s make it <span className="accent">real.</span>
        </h2>
        <div className={styles.actions} data-reveal="fade">
          <Button href="#contact" magnetic onClick={() => track('start_project_clicked', { location: 'final-cta' })}>
            Start a project
          </Button>
          <Button href={SITE.contactEmail ? `mailto:${SITE.contactEmail}` : '#contact'} variant="ghost" cursor="link">
            Say hello
          </Button>
        </div>
      </div>
    </section>
  )
}

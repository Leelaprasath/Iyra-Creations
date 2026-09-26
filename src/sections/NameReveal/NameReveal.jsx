import { useRef } from 'react'
import { Button } from '../../components/ui/Button'
import { nameRevealDemo } from '../../data/nameReveal'
import { services } from '../../data/services'
import { useReveal } from '../../hooks/useReveal'
import { useSectionProgress } from '../../hooks/useSectionProgress'
import { scrollToTarget } from '../../runtime/smoothScroll'
import { useTier } from '../../store/useAppStore'
import { track } from '../../utils/analytics'
import { range } from '../../utils/math'
import styles from './NameReveal.module.css'

const service = services.find((s) => s.id === 'namereveal')
const { name, subtitle, timeline } = nameRevealDemo

/**
 * The emotional peak of the journey. WebGL tiers reveal the name in particles
 * (3d/scenes/NameRevealScene); the fallback tier reveals DOM letters. Beat
 * opacities are written as CSS variables from the shared scroll tracker.
 */
export function NameReveal() {
  const ref = useRef(null)
  const sticky = useRef(null)
  const tier = useTier()
  useReveal(ref)

  useSectionProgress(service.sceneId, ({ pin }) => {
    const el = sticky.current
    if (!el) return
    el.style.setProperty('--letters', (range(pin, ...timeline.letters) * name.length).toFixed(3))
    el.style.setProperty('--intro', (1 - range(pin, timeline.dust[0], timeline.letters[0] + 0.06)).toFixed(3))
    el.style.setProperty('--subtitle', range(pin, ...timeline.subtitle).toFixed(3))
    el.style.setProperty('--outro', range(pin, ...timeline.outro).toFixed(3))
  })

  // Keyboard users reaching the CTA early are scrolled to the moment it belongs to.
  const revealOutro = () => {
    const el = ref.current
    const top = el.getBoundingClientRect().top + window.scrollY
    scrollToTarget(top + timeline.outro[1] * (el.offsetHeight - window.innerHeight), { immediate: true })
  }

  return (
    <section
      ref={ref}
      id={service.anchor}
      className={styles.section}
      data-scene={service.sceneId}
      aria-labelledby="name-reveal-title"
    >
      <div ref={sticky} className={styles.sticky}>
        <div className={`container ${styles.head}`}>
          <p className="label" data-reveal="fade">
            <span className="accent">{service.index}</span> — {service.name}
          </p>
          <h2 id="name-reveal-title" className={styles.title} data-reveal="lines">
            {service.title.join(' ')}
          </h2>
        </div>

        <div className={styles.stage}>
          <p className={tier === 'fallback' ? styles.name : 'visually-hidden'}>
            <span className="visually-hidden">
              Demonstration name reveal: {name}, {subtitle}.
            </span>
            <span aria-hidden="true">
              {[...name].map((ch, i) => (
                <span key={i} className={styles.letter} style={{ '--i': i }}>
                  {ch}
                </span>
              ))}
            </span>
          </p>
          <p className={styles.subtitle} aria-hidden="true">
            {subtitle}
          </p>
        </div>

        <div className={`container ${styles.outro}`}>
          <p className={styles.statement}>
            Your story. <br />
            Your name. <br />
            <span className="accent">Your moment.</span>
          </p>
          <div className={styles.outroSide}>
            <p className={styles.copy}>{service.copy}</p>
            <Button
              href="#contact"
              magnetic
              onFocus={revealOutro}
              onClick={() => track('name_reveal_clicked', { location: 'name-reveal' })}
            >
              Create a name reveal
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

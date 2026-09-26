import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Button } from '../../components/ui/Button'
import { DURATION, EASE, STAGGER } from '../../config/motion'
import { useSectionProgress } from '../../hooks/useSectionProgress'
import { useAppStore } from '../../store/useAppStore'
import { track } from '../../utils/analytics'
import { range } from '../../utils/math'
import styles from './Hero.module.css'

gsap.registerPlugin(useGSAP)

export function Hero() {
  const ref = useRef(null)
  const indicator = useRef(null)
  const introPhase = useAppStore((s) => s.introPhase)
  const reduced = useAppStore((s) => s.reducedMotion)
  const tier = useAppStore((s) => s.tier)
  const play = introPhase === 'revealing' || introPhase === 'done'

  // Entrance, synchronised with the intro's camera pull-back.
  useGSAP(
    () => {
      const root = ref.current
      const lines = root.querySelectorAll(`.${styles.line}`)
      const rest = root.querySelectorAll('[data-hero-fade]')
      if (!play) {
        gsap.set(lines, { yPercent: 110 })
        gsap.set(rest, { autoAlpha: 0 })
        return
      }
      const tl = gsap.timeline({ delay: reduced ? 0 : 0.35 })
      tl.to(lines, {
        yPercent: 0,
        duration: reduced ? 0.01 : DURATION.cinematic,
        ease: EASE.out,
        stagger: STAGGER.lines,
      })
      tl.to(
        rest,
        { autoAlpha: 1, y: 0, duration: DURATION.base, ease: EASE.soft, stagger: STAGGER.items },
        reduced ? 0 : '-=1.1',
      )
    },
    { scope: ref, dependencies: [play] },
  )

  // Scroll indicator fades as soon as the journey starts.
  useSectionProgress('hero', ({ view }) => {
    if (indicator.current) indicator.current.style.opacity = String(1 - range(view, 0.5, 0.58))
  })

  return (
    <section ref={ref} id="top" className={styles.hero} data-scene="hero" aria-labelledby="hero-title">
      <div className={`container ${styles.inner}`}>
        <p className={`label ${styles.eyebrow}`} data-hero-fade>
          <span className="accent">IYRA Creations</span> — Creative technology studio
        </p>

        <h1 id="hero-title" className={styles.title}>
          <span className={styles.mask}>
            <span className={styles.line}>We don&apos;t</span>
          </span>
          <span className={styles.mask}>
            <span className={styles.line}>just build.</span>
          </span>
          <span className={`${styles.mask} ${styles.gap}`}>
            <span className={styles.line}>We create</span>
          </span>
          <span className={styles.mask}>
            <span className={`${styles.line} ${styles.accentLine}`}>
              experiences<span className="accent">.</span>
            </span>
          </span>
        </h1>

        <div className={styles.foot}>
          <p className={`lead ${styles.copy}`} data-hero-fade>
            Digital experiences, products, brands and visual stories crafted by IYRA Creations.
          </p>
          <div className={styles.actions} data-hero-fade>
            <Button href="#contact" magnetic onClick={() => track('start_project_clicked', { location: 'hero' })}>
              Start a project
            </Button>
            <Button href="#work" variant="ghost" cursor="link">
              Explore our work
            </Button>
          </div>
        </div>
      </div>

      {tier === 'fallback' && <div className={styles.fallbackCore} aria-hidden="true" />}

      <div ref={indicator} className={styles.scroll} aria-hidden="true" data-hero-fade>
        <span>Scroll to explore</span>
        <i />
      </div>
    </section>
  )
}

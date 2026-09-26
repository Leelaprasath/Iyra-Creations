import { useRef } from 'react'
import { projects } from '../../data/projects'
import { useReveal } from '../../hooks/useReveal'
import { useSectionProgress } from '../../hooks/useSectionProgress'
import { scrollToTarget } from '../../runtime/smoothScroll'
import { useLayout } from '../../store/useAppStore'
import { ProjectCard } from './ProjectCard'
import styles from './Work.module.css'

/**
 * "Selected creations". Desktop: a pinned gallery that travels horizontally as
 * the visitor scrolls (plain vertical scrolling — no hijacked gestures).
 * Tablet/mobile: a vertical sequence of large project panels.
 */
export function Work() {
  const ref = useRef(null)
  const track = useRef(null)
  const layout = useLayout()
  const horizontal = layout === 'desktop'
  useReveal(ref)

  useSectionProgress('work-gallery', ({ pin }) => {
    const el = track.current
    if (!el) return
    if (!horizontal) {
      el.style.transform = ''
      return
    }
    const distance = el.scrollWidth - window.innerWidth
    el.style.transform = `translate3d(${(-pin * Math.max(0, distance)).toFixed(1)}px, 0, 0)`
  })

  // Keyboard focus on an off-screen slide scrolls the pinned gallery to it.
  const focusSlide = (i) => {
    if (!horizontal) return
    const gallery = track.current.closest('[data-track]')
    const top = gallery.getBoundingClientRect().top + window.scrollY
    const range = gallery.offsetHeight - window.innerHeight
    scrollToTarget(top + (i / Math.max(1, projects.length - 1)) * range, { immediate: true })
  }

  return (
    <section ref={ref} id="work" className={styles.work} data-scene="work" aria-labelledby="work-title">
      <div className={`container ${styles.intro}`}>
        <p className="label label--accent" data-reveal="fade">
          Work
        </p>
        <h2 id="work-title" className={styles.title} data-reveal="lines">
          Selected <br />
          creations<span className="accent">.</span>
        </h2>
        <div className={styles.introFoot}>
          <p className="lead" data-reveal="fade">
            A selection of digital products, identities and experiences created by IYRA.
          </p>
          <p className={styles.note} data-reveal="fade">
            Shown here: IYRA studio concept studies. Client case studies are added as projects launch.
          </p>
        </div>
      </div>

      <div
        className={styles.gallery}
        data-track="work-gallery"
        data-horizontal={horizontal || undefined}
        style={{ '--count': projects.length }}
      >
        <div className={styles.sticky}>
          <ol ref={track} className={styles.track}>
            {projects.map((p, i) => (
              <li key={p.id} className={styles.slide} onFocus={() => focusSlide(i)}>
                <ProjectCard project={p} index={i} />
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

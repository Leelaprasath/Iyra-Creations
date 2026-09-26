import { useRef } from 'react'
import { TransitionLink } from '../../components/common/TransitionLink'
import { useAppStore } from '../../store/useAppStore'
import { track } from '../../utils/analytics'
import styles from './ProjectCard.module.css'

const TILT = 6 // degrees

/**
 * Project panel: the whole card is one link (keyboard + screen reader friendly).
 * Pointer hover adds a restrained perspective tilt and image drift.
 */
export function ProjectCard({ project, index }) {
  const ref = useRef(null)

  const onMove = (e) => {
    if (e.pointerType !== 'mouse' || useAppStore.getState().reducedMotion) return
    const el = ref.current
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.setProperty('--ry', `${(x * TILT).toFixed(2)}deg`)
    el.style.setProperty('--rx', `${(-y * TILT).toFixed(2)}deg`)
    el.style.setProperty('--mx', x.toFixed(3))
    el.style.setProperty('--my', y.toFixed(3))
  }
  const onLeave = () => {
    const el = ref.current
    ;['--ry', '--rx', '--mx', '--my'].forEach((p) => el.style.removeProperty(p))
  }

  return (
    <article ref={ref} className={styles.card} onPointerMove={onMove} onPointerLeave={onLeave}>
      <TransitionLink
        to={`/work/${project.slug}`}
        className={styles.link}
        data-cursor="project"
        onClick={() => track('project_opened', { project: project.slug })}
        aria-label={`${project.title} — ${project.category} concept, ${project.year}. View project`}
      >
        <figure className={styles.media}>
          <img src={project.thumbnail} alt="" loading="lazy" decoding="async" width="1600" height="1000" />
        </figure>
        <div className={styles.meta}>
          <span className={styles.index}>{String(index + 1).padStart(2, '0')}</span>
          <span>{project.category}</span>
          <span>{project.year}</span>
          {project.concept && <span className={styles.tag}>Concept</span>}
        </div>
        <h3 className={styles.title}>{project.title}</h3>
        <p className={styles.desc}>{project.description}</p>
        {project.technologies?.length > 0 && (
          <ul className={styles.tech} aria-label="Technology">
            {project.technologies.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        )}
        <span className={styles.cta} aria-hidden="true">
          View project →
        </span>
      </TransitionLink>
    </article>
  )
}

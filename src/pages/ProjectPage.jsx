import { useRef } from 'react'
import { useParams } from 'react-router'
import { TransitionLink } from '../components/common/TransitionLink'
import { Button } from '../components/ui/Button'
import { getNextProject, getProject } from '../data/projects'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { useReveal } from '../hooks/useReveal'
import NotFoundPage from './NotFoundPage'
import styles from './ProjectPage.module.css'

/** Case-study sections, rendered in this order when the project provides them. */
const SECTIONS = [
  ['overview', 'Overview'],
  ['challenge', 'Challenge'],
  ['approach', 'Approach'],
  ['design', 'Design'],
  ['technology', 'Technology'],
  ['result', 'Result'],
]

function ProjectDetail({ project }) {
  const ref = useRef(null)
  const next = getNextProject(project.slug)
  useReveal(ref)
  useDocumentMeta({ title: project.title, description: project.description })

  const details = SECTIONS.filter(([key]) => project.details?.[key])

  return (
    <article ref={ref} className={styles.page} data-scene="work" aria-labelledby="project-title">
      <header className={`container ${styles.head}`}>
        <TransitionLink to="/#work" className={styles.back} data-cursor="link">
          ← All work
        </TransitionLink>
        <div className={styles.meta} data-reveal="fade">
          <span className="accent">{project.category}</span>
          <span>{project.year}</span>
          {project.concept && <span className={styles.tag}>IYRA concept study</span>}
        </div>
        <h1 id="project-title" className={styles.title} data-reveal="lines">
          {project.title}
        </h1>
        <p className="lead" data-reveal="fade">
          {project.description}
        </p>
        {project.concept && (
          <p className={styles.conceptNote} data-reveal="fade">
            This is exploratory studio work by IYRA Creations, not a client engagement.
          </p>
        )}
      </header>

      <figure className={`container ${styles.hero}`} data-reveal="fade">
        <img src={project.heroMedia} alt={`${project.title} — key visual`} width="1600" height="1000" decoding="async" />
      </figure>

      <div className={`container ${styles.body}`}>
        <dl className={styles.facts} data-reveal="fade">
          {project.services?.length > 0 && (
            <div>
              <dt>Services</dt>
              <dd>{project.services.join(', ')}</dd>
            </div>
          )}
          {project.technologies?.length > 0 && (
            <div>
              <dt>Technology</dt>
              <dd>{project.technologies.join(', ')}</dd>
            </div>
          )}
          <div>
            <dt>Year</dt>
            <dd>{project.year}</dd>
          </div>
        </dl>

        <div className={styles.sections}>
          {details.map(([key, label]) => (
            <section key={key} className={styles.section} aria-labelledby={`project-${key}`}>
              <h2 id={`project-${key}`} className="label label--accent">
                {label}
              </h2>
              <p className={styles.sectionText} data-reveal="fade">
                {project.details[key]}
              </p>
            </section>
          ))}
        </div>
      </div>

      {project.gallery?.length > 0 && (
        <section className={`container ${styles.gallery}`} aria-label="Gallery">
          {project.gallery.map((item) => (
            <figure key={item.src}>
              <img src={item.src} alt={item.alt} loading="lazy" decoding="async" />
            </figure>
          ))}
        </section>
      )}

      <nav className={`container ${styles.next}`} aria-label="Next project">
        <p className="label">Next project</p>
        <TransitionLink to={`/work/${next.slug}`} className={styles.nextLink} data-cursor="project">
          {next.title} <span aria-hidden="true">→</span>
        </TransitionLink>
        <div className={styles.nextCta}>
          <Button href="/#contact" magnetic>
            Start a project
          </Button>
        </div>
      </nav>
    </article>
  )
}

export default function ProjectPage() {
  const { slug } = useParams()
  const project = getProject(slug)
  if (!project) return <NotFoundPage />
  // Keyed so navigating between projects remounts reveals and meta.
  return <ProjectDetail key={project.slug} project={project} />
}

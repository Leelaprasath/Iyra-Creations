import { TransitionLink } from '../components/common/TransitionLink'
import { Button } from '../components/ui/Button'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import styles from './NotFoundPage.module.css'

/** "404" inside the logo's open bracket frame, with an offset orange echo. */
function Illustration() {
  return (
    <svg className={styles.art} viewBox="0 0 520 300" role="img" aria-labelledby="nf-art-title">
      <title id="nf-art-title">404 inside the IYRA bracket frame</title>
      {/* Orange echo, slightly offset */}
      <g className={styles.echo} transform="translate(10 8)">
        <path d="M120 30H30V270H120 M400 30H490V270H400" />
      </g>
      {/* Bracket frame, matching the logo */}
      <g className={styles.frame}>
        <path d="M120 30H30V270H120 M400 30H490V270H400" />
      </g>
      <text x="260" y="196" textAnchor="middle" className={styles.digits}>
        404
      </text>
      <text x="260" y="250" textAnchor="middle" className={styles.caption}>
        PAGE NOT FOUND
      </text>
    </svg>
  )
}

export default function NotFoundPage() {
  useDocumentMeta({ title: 'Page not found' })
  return (
    <section data-scene="philosophy" className={`container ${styles.page}`} aria-labelledby="nf-title">
      <div className={styles.copy}>
        <p className="label label--accent">Error 404</p>
        <h1 id="nf-title" className={styles.title}>
          Page not found<span className="accent">.</span>
        </h1>
        <p className={`lead ${styles.lead}`}>
          The page you are looking for doesn’t exist or has been moved. Let’s get you back to something we did create.
        </p>
        <div className={styles.actions}>
          <Button to="/">Back to home</Button>
          <TransitionLink to="/#work" className={styles.link} data-cursor="link">
            See our work
          </TransitionLink>
        </div>
      </div>
      <Illustration />
    </section>
  )
}

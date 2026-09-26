import { TransitionLink } from '../components/common/TransitionLink'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function NotFoundPage() {
  useDocumentMeta({ title: 'Page not found' })
  return (
    <section
      data-scene="philosophy"
      className="container"
      style={{ minHeight: '100svh', display: 'grid', alignContent: 'center', gap: '1.5rem', position: 'relative', zIndex: 1 }}
      aria-labelledby="nf-title"
    >
      <p className="label label--accent">404</p>
      <h1 id="nf-title" className="h2">
        This page <br />
        was never created.
      </h1>
      <TransitionLink to="/" className="label" style={{ color: 'var(--c-white)', minHeight: 44, display: 'inline-flex', alignItems: 'center' }}>
        ← Back to IYRA
      </TransitionLink>
    </section>
  )
}

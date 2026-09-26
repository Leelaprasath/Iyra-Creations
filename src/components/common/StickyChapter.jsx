import { useRef } from 'react'
import { useReveal } from '../../hooks/useReveal'
import { useSectionProgress } from '../../hooks/useSectionProgress'
import { useTier } from '../../store/useAppStore'
import styles from './StickyChapter.module.css'

/**
 * A pinned story chapter (CSS sticky, no pin spacers). Its scroll progress —
 * from the shared tracker — drives both the matching WebGL scene and the DOM
 * stage rail here, so words and visuals always show the same stage.
 *
 * `side` places the copy ('left' | 'right'); the 3D object occupies the other
 * half on desktop and the top of the screen on mobile. `fallback` renders in
 * that visual slot when WebGL is unavailable. `onStage(index)` fires when the
 * active stage changes.
 */
export function StickyChapter({
  sceneId,
  anchorId,
  index,
  eyebrow,
  title,
  copy,
  stages,
  side = 'left',
  length = 3,
  fallback,
  children,
  onStage,
  labelledBy,
}) {
  const ref = useRef(null)
  const sticky = useRef(null)
  const lastStage = useRef(-1)
  const tier = useTier()
  useReveal(ref)

  useSectionProgress(sceneId, ({ pin }) => {
    const el = sticky.current
    if (!el) return
    const n = stages.length
    const stage = Math.min(n - 1, Math.floor(pin * n))
    el.style.setProperty('--progress', pin.toFixed(4))
    if (stage === lastStage.current) return
    lastStage.current = stage
    el.style.setProperty('--stage', String(stage))
    el.querySelectorAll('[data-stage-item]').forEach((li, i) => {
      li.toggleAttribute('data-active', i === stage)
      li.toggleAttribute('data-done', i < stage)
      if (i === stage) li.setAttribute('aria-current', 'step')
      else li.removeAttribute('aria-current')
    })
    onStage?.(stage)
  })

  const headingId = labelledBy ?? `${anchorId}-title`

  return (
    <section
      ref={ref}
      id={anchorId}
      className={styles.chapter}
      data-scene={sceneId}
      data-side={side}
      style={{ '--length': length }}
      aria-labelledby={headingId}
    >
      <div ref={sticky} className={styles.sticky} style={{ '--stage': 0, '--progress': 0 }}>
        <div className={`container ${styles.grid}`}>
          <div className={styles.text}>
            <p className={`label ${styles.eyebrow}`} data-reveal="fade">
              <span className="accent">{index}</span> — {eyebrow}
            </p>
            <h2 id={headingId} className={styles.title} data-reveal="lines">
              {title.map((line) => (
                <span key={line} className={styles.titleLine}>
                  {line}
                </span>
              ))}
            </h2>
            {copy && (
              <p className={`lead ${styles.copy}`} data-reveal="fade">
                {copy}
              </p>
            )}
            <ol className={styles.rail} data-reveal="fade" aria-label={`${eyebrow} stages`}>
              {stages.map((stage, i) => (
                <li key={stage.label ?? stage} data-stage-item className={styles.stage}>
                  <span className={styles.stageNum}>{String(i + 1).padStart(2, '0')}</span>
                  <span className={styles.stageLabel}>{stage.label ?? stage}</span>
                  {stage.text && <span className={styles.stageText}>{stage.text}</span>}
                </li>
              ))}
            </ol>
            <span className={styles.meter} aria-hidden="true" />
            {children}
          </div>
          <div className={styles.visual} aria-hidden="true">
            {tier === 'fallback' && fallback}
          </div>
        </div>
      </div>
    </section>
  )
}

import styles from './FallbackBackdrop.module.css'

/**
 * Background for the "fallback" tier (no WebGL / very low capability):
 * layered CSS light in the IYRA palette with slow drift (static for reduced motion).
 * Section-specific visuals are provided by each section's DOM fallback.
 */
export function FallbackBackdrop() {
  return (
    <div className={styles.backdrop} aria-hidden="true">
      <div className={styles.glow} />
      <div className={styles.grain} />
    </div>
  )
}

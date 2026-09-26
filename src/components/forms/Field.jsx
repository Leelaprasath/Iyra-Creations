import styles from './ContactForm.module.css'

/** Labelled form control with an associated, announced error message. */
export function Field({
  name,
  label,
  required = false,
  error,
  hint,
  as = 'input',
  children,
  className = '',
  ...props
}) {
  const id = `field-${name}`
  const errorId = `${id}-error`
  const hintId = hint ? `${id}-hint` : undefined
  const Control = as
  const describedBy = [hintId, error ? errorId : null].filter(Boolean).join(' ') || undefined

  return (
    <div className={`${styles.field} ${className}`} data-invalid={error ? '' : undefined}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required ? (
          <span className={styles.required} aria-hidden="true">
            {' '}
            *
          </span>
        ) : (
          <span className={styles.optional}> (optional)</span>
        )}
      </label>
      <Control
        id={id}
        name={name}
        className={styles.control}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy}
        required={required}
        {...props}
      >
        {children}
      </Control>
      {hint && (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      )}
      <p id={errorId} className={styles.error}>
        {error}
      </p>
    </div>
  )
}

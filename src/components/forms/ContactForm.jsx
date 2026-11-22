import { useRef, useState } from 'react'
import { budgetOptions } from '../../data/contact'
import { serviceChoices } from '../../data/services'
import { buildMailto, ContactNotConfiguredError, submitContact } from '../../services/contactAdapter'
import { track } from '../../utils/analytics'
import { Button } from '../ui/Button'
import { Field } from './Field'
import { EMPTY_CONTACT, MESSAGE_MAX, toPayload, validateContact, validateField } from './validation'
import styles from './ContactForm.module.css'

/**
 * Project enquiry form: native semantics, inline validation on blur, a focus
 * jump to the first error on submit, explicit loading / success / error
 * states. Submission goes through services/contactAdapter.
 */
export function ContactForm() {
  const formRef = useRef(null)
  const statusRef = useRef(null)
  const started = useRef(false)
  const [values, setValues] = useState(EMPTY_CONTACT)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  // idle | submitting | success | error | unconfigured
  const [status, setStatus] = useState('idle')

  const update = (e) => {
    const { name, value } = e.target
    if (!started.current) {
      started.current = true
      track('contact_started')
    }
    setValues((v) => ({ ...v, [name]: value }))
    if (touched[name]) setErrors((err) => ({ ...err, [name]: validateField(name, value) }))
  }

  const blur = (e) => {
    const { name, value } = e.target
    setTouched((t) => ({ ...t, [name]: true }))
    setErrors((err) => ({ ...err, [name]: validateField(name, value) }))
  }

  const submit = async (e) => {
    e.preventDefault()
    if (status === 'submitting') return
    const nextErrors = validateContact(values)
    setErrors(nextErrors)
    setTouched(Object.fromEntries(Object.keys(EMPTY_CONTACT).map((k) => [k, true])))
    const firstInvalid = Object.keys(EMPTY_CONTACT).find((k) => nextErrors[k])
    if (firstInvalid) {
      formRef.current.querySelector(`[name="${firstInvalid}"]`)?.focus()
      return
    }

    setStatus('submitting')
    try {
      const website = formRef.current.elements.website?.value || ''
      await submitContact({ ...toPayload(values), website })
      setStatus('success')
      track('contact_submitted', { service: values.service })
    } catch (err) {
      setStatus(err instanceof ContactNotConfiguredError ? 'unconfigured' : 'error')
    }
    requestAnimationFrame(() => statusRef.current?.focus())
  }

  if (status === 'success') {
    return (
      <div ref={statusRef} className={styles.success} tabIndex={-1} role="status">
        <p className={styles.successTitle}>
          Thank you<span className="accent">.</span>
        </p>
        <p className="lead">Your message has reached IYRA Creations. We will reply to {values.email.trim()}.</p>
        <button
          type="button"
          className={styles.reset}
          onClick={() => {
            setValues(EMPTY_CONTACT)
            setTouched({})
            setErrors({})
            setStatus('idle')
          }}
        >
          Send another message
        </button>
      </div>
    )
  }

  const mailto = buildMailto(toPayload(values))
  const shown = (field) => (touched[field] ? errors[field] : '')

  return (
    <form ref={formRef} className={styles.form} onSubmit={submit} noValidate aria-describedby="form-note">
      <p id="form-note" className={styles.note}>
        Fields marked <span aria-hidden="true">*</span>
        <span className="visually-hidden">with an asterisk</span> are required.
      </p>

      {/* Honeypot: hidden from people and assistive tech; bots that fill it are dropped server-side. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        defaultValue=""
        style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, opacity: 0 }}
      />

      <div className={styles.row}>
        <Field
          name="name"
          label="Name"
          required
          autoComplete="name"
          value={values.name}
          onChange={update}
          onBlur={blur}
          error={shown('name')}
        />
        <Field
          name="email"
          label="Email"
          required
          type="email"
          autoComplete="email"
          inputMode="email"
          value={values.email}
          onChange={update}
          onBlur={blur}
          error={shown('email')}
        />
      </div>
      <div className={styles.row}>
        <Field
          name="phone"
          label="Phone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          value={values.phone}
          onChange={update}
          onBlur={blur}
          error={shown('phone')}
        />
        <Field
          name="company"
          label="Company"
          autoComplete="organization"
          value={values.company}
          onChange={update}
          onBlur={blur}
          error={shown('company')}
        />
      </div>
      <div className={styles.row}>
        <Field
          as="select"
          name="service"
          label="Service"
          required
          value={values.service}
          onChange={update}
          onBlur={blur}
          error={shown('service')}
        >
          <option value="" disabled>
            Select a service
          </option>
          {serviceChoices.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Field>
        <Field
          as="select"
          name="budget"
          label="Budget"
          value={values.budget}
          onChange={update}
          onBlur={blur}
          error={shown('budget')}
        >
          <option value="">Select a range</option>
          {budgetOptions.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </Field>
      </div>
      <Field
        as="textarea"
        name="message"
        label="Project description"
        required
        rows={5}
        maxLength={MESSAGE_MAX}
        hint="Goals, timeline, anything we should know."
        value={values.message}
        onChange={update}
        onBlur={blur}
        error={shown('message')}
        className={styles.full}
      />

      <div className={styles.actions}>
        <Button type="submit" magnetic disabled={status === 'submitting'} aria-disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Sending…' : 'Send enquiry'}
        </Button>
        <div ref={statusRef} tabIndex={-1} className={styles.status} aria-live="polite">
          {status === 'submitting' && <p>Sending your message…</p>}
          {status === 'error' && (
            <p className={styles.statusError}>
              Something went wrong sending your message. Please try again in a moment.
            </p>
          )}
          {status === 'unconfigured' && (
            <p className={styles.statusError}>
              Online enquiries are not connected yet, so your message was not sent.{' '}
              {mailto ? (
                <a href={mailto} className={styles.inlineLink}>
                  Email it to us instead
                </a>
              ) : (
                'Please try again later.'
              )}
            </p>
          )}
        </div>
      </div>
    </form>
  )
}

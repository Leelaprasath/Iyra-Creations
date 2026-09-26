import { useRef } from 'react'
import { ContactForm } from '../../components/forms/ContactForm'
import { SITE } from '../../config/site'
import { useReveal } from '../../hooks/useReveal'
import styles from './Contact.module.css'

export function Contact() {
  const ref = useRef(null)
  useReveal(ref)

  return (
    <section ref={ref} id="contact" className={styles.contact} data-scene="contact" aria-labelledby="contact-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.intro}>
          <p className="label label--accent" data-reveal="fade">
            Contact
          </p>
          <h2 id="contact-title" className={styles.title} data-reveal="lines">
            Tell us about <br />
            your idea.
          </h2>
          <p className="lead" data-reveal="fade">
            Websites, SaaS products, logos, complete brands and name reveal films. Share what you have in mind and we
            will shape the next step together.
          </p>
          {SITE.contactEmail && (
            <a className={styles.mail} href={`mailto:${SITE.contactEmail}`} data-reveal="fade">
              {SITE.contactEmail}
            </a>
          )}
        </div>
        <div className={styles.formWrap} data-reveal="fade">
          <ContactForm />
        </div>
      </div>
    </section>
  )
}

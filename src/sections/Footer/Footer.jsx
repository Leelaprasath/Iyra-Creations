import { SITE } from '../../config/site'
import { navigation } from '../../data/navigation'
import { services } from '../../data/services'
import { socialLinks } from '../../data/socialLinks'
import { BrandLogo } from '../../components/ui/BrandLogo'
import styles from './Footer.module.css'

const ICON_PATHS = {
  email: 'M3 5h18v14H3z M3 6l9 7 9-7',
  phone:
    'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2',
  whatsapp:
    'M3.5 20.5l1.3-4.1A8.5 8.5 0 1 1 8 19.4z M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.6-2-1-1 .8a5 5 0 0 1-2.7-2.7l.8-1-1-2z',
  instagram: 'M4 4h16v16H4z M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 1 0 0-7 M17 7h.01',
}

function Icon({ id }) {
  const d = ICON_PATHS[id]
  if (!d) return null
  return (
    <svg
      className={styles.icon}
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={d} />
    </svg>
  )
}

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          <nav aria-label="Footer" className={styles.col}>
            <p className="label">Explore</p>
            <ul>
              {navigation.map((n) => (
                <li key={n.hash}>
                  <a href={`/#${n.hash}`}>{n.label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <div className={styles.col}>
            <p className="label">Services</p>
            <ul>
              {services.map((s) => (
                <li key={s.id}>
                  <a href={`/#${s.anchor}`}>{s.name}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.col}>
            <p className="label">Connect</p>
            <ul>
              {SITE.contactEmail && (
                <li>
                  <a href={`mailto:${SITE.contactEmail}`} className={styles.contact}>
                    <Icon id="email" />
                    {SITE.contactEmail}
                  </a>
                </li>
              )}
              <li>
                <a href={`tel:+${SITE.phone.digits}`} className={styles.contact}>
                  <Icon id="phone" />
                  {SITE.phone.display}
                </a>
              </li>
              {socialLinks.map((s) => (
                <li key={s.id}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className={styles.contact}>
                    <Icon id={s.id} />
                    {s.label}
                    <span className="visually-hidden"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <BrandLogo className={styles.wordmark} height={181} alt="IYRA Creations" loading="lazy" />

        <div className={styles.bottom}>
          <p>© {year} IYRA Creations. All rights reserved.</p>
          <a href="/#top" className={styles.top_link}>
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  )
}

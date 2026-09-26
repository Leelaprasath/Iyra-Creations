import { SITE } from '../../config/site'
import { navigation } from '../../data/navigation'
import { services } from '../../data/services'
import { socialLinks } from '../../data/socialLinks'
import { Logo } from '../../components/ui/Logo'
import styles from './Footer.module.css'

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
          {(SITE.contactEmail || socialLinks.length > 0) && (
            <div className={styles.col}>
              <p className="label">Connect</p>
              <ul>
                {SITE.contactEmail && (
                  <li>
                    <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>
                  </li>
                )}
                {socialLinks.map((s) => (
                  <li key={s.href}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <Logo className={styles.wordmark} height={186} />

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

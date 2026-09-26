import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { navigation } from '../../data/navigation'
import { DURATION, EASE, STAGGER } from '../../config/motion'
import { useAppStore } from '../../store/useAppStore'
import { track } from '../../utils/analytics'
import { Logo } from '../ui/Logo'
import { TransitionLink } from '../common/TransitionLink'
import { MobileMenu } from './MobileMenu'
import styles from './Header.module.css'

export function Header() {
  const ref = useRef(null)
  const introPhase = useAppStore((s) => s.introPhase)
  const menuOpen = useAppStore((s) => s.menuOpen)
  const setMenuOpen = useAppStore((s) => s.setMenuOpen)
  const visible = introPhase === 'revealing' || introPhase === 'done'

  useGSAP(
    () => {
      const items = ref.current.querySelectorAll('[data-header-item]')
      if (!visible) {
        gsap.set(items, { autoAlpha: 0, y: -12 })
        return
      }
      gsap.to(items, { autoAlpha: 1, y: 0, duration: DURATION.base, ease: EASE.out, stagger: STAGGER.items, delay: 0.4 })
    },
    { scope: ref, dependencies: [visible] },
  )

  return (
    <header ref={ref} className={styles.header}>
      <div className={styles.inner}>
        <TransitionLink to="/" className={styles.logo} aria-label="IYRA Creations — home" data-header-item data-cursor="link">
          <Logo height={40} />
        </TransitionLink>

        <nav aria-label="Primary" className={styles.nav}>
          <ul>
            {navigation.map((item) => (
              <li key={item.hash} data-header-item>
                <a href={`/#${item.hash}`} className={styles.link} data-cursor="link">
                  <span data-text={item.label}>{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a
          href="/#contact"
          className={styles.cta}
          data-header-item
          data-cursor="cta"
          onClick={() => track('start_project_clicked', { location: 'header' })}
        >
          Start a project
        </a>

        <button
          type="button"
          className={styles.menuButton}
          data-header-item
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="visually-hidden">{menuOpen ? 'Close menu' : 'Open menu'}</span>
          <span className={styles.menuLabel} aria-hidden="true">
            {menuOpen ? 'Close' : 'Menu'}
          </span>
          <span className={`${styles.burger} ${menuOpen ? styles.open : ''}`} aria-hidden="true">
            <i />
            <i />
          </span>
        </button>
      </div>
      <MobileMenu />
    </header>
  )
}

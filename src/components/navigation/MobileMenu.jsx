import { useEffect, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { navigation } from '../../data/navigation'
import { SITE } from '../../config/site'
import { DURATION, EASE, STAGGER } from '../../config/motion'
import { lockScroll } from '../../runtime/smoothScroll'
import { useAppStore } from '../../store/useAppStore'
import styles from './MobileMenu.module.css'

/**
 * Fullscreen cinematic menu for tablet/mobile. Traps focus while open,
 * closes on Escape / link activation / resize to desktop.
 */
export function MobileMenu() {
  const ref = useRef(null)
  const open = useAppStore((s) => s.menuOpen)
  const setOpen = useAppStore((s) => s.setMenuOpen)
  const layout = useAppStore((s) => s.layout)
  const reduced = useAppStore((s) => s.reducedMotion)

  useEffect(() => {
    if (layout === 'desktop' && open) setOpen(false)
  }, [layout, open, setOpen])

  useEffect(() => {
    if (!open) return
    lockScroll(true)
    const el = ref.current
    el.querySelector('a')?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        document.querySelector('[aria-controls="mobile-menu"]')?.focus()
      }
      if (e.key !== 'Tab') return
      const focusables = [document.querySelector('[aria-controls="mobile-menu"]'), ...el.querySelectorAll('a')].filter(
        Boolean,
      )
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      lockScroll(false)
    }
  }, [open, setOpen])

  useGSAP(
    () => {
      const el = ref.current
      const items = el.querySelectorAll('[data-menu-item]')
      if (open) {
        gsap.set(el, { visibility: 'visible' })
        gsap.fromTo(
          el,
          { clipPath: 'inset(0 0 100% 0)' },
          { clipPath: 'inset(0 0 0% 0)', duration: reduced ? 0.01 : DURATION.base, ease: EASE.inOut },
        )
        gsap.fromTo(
          items,
          { yPercent: reduced ? 0 : 100, autoAlpha: 0 },
          {
            yPercent: 0,
            autoAlpha: 1,
            duration: reduced ? 0.2 : DURATION.base,
            ease: EASE.out,
            stagger: STAGGER.items,
            delay: reduced ? 0 : 0.25,
          },
        )
      } else {
        gsap.to(el, {
          clipPath: 'inset(0 0 100% 0)',
          duration: reduced ? 0.01 : DURATION.fast,
          ease: EASE.in,
          onComplete: () => gsap.set(el, { visibility: 'hidden' }),
        })
      }
    },
    { scope: ref, dependencies: [open] },
  )

  return (
    <div
      ref={ref}
      id="mobile-menu"
      className={styles.menu}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      aria-hidden={!open}
      inert={!open}
    >
      <nav aria-label="Mobile">
        <ol className={styles.list}>
          {navigation.map((item, i) => (
            <li key={item.hash} className={styles.row}>
              <a
                href={`/#${item.hash}`}
                className={styles.link}
                data-menu-item
                onClick={() => setOpen(false)}
                tabIndex={open ? 0 : -1}
              >
                <span className={styles.num}>{String(i + 1).padStart(2, '0')}</span>
                {item.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <div className={styles.foot} data-menu-item>
        <a href="/#contact" className={styles.cta} onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
          Start a project →
        </a>
        {SITE.contactEmail && (
          <a href={`mailto:${SITE.contactEmail}`} className={styles.mail} tabIndex={open ? 0 : -1}>
            {SITE.contactEmail}
          </a>
        )}
      </div>
    </div>
  )
}

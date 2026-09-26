import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Link } from 'react-router'
import { useReducedMotion } from '../../store/useAppStore'
import styles from './Button.module.css'

const MAGNET_STRENGTH = 0.28

/**
 * Primary interactive element.
 * - `to` renders a router Link, `href` an anchor, otherwise a <button>.
 * - `magnetic` is reserved for the key CTAs (fine pointers only, off for reduced motion).
 */
export function Button({
  to,
  href,
  variant = 'primary',
  magnetic = false,
  cursor = 'cta',
  className = '',
  children,
  ...rest
}) {
  const ref = useRef(null)
  const reduced = useReducedMotion()

  useGSAP(
    () => {
      const el = ref.current
      if (!magnetic || reduced || !el || !window.matchMedia('(pointer: fine)').matches) return
      const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' })
      const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' })
      const move = (e) => {
        const r = el.getBoundingClientRect()
        xTo((e.clientX - (r.left + r.width / 2)) * MAGNET_STRENGTH)
        yTo((e.clientY - (r.top + r.height / 2)) * MAGNET_STRENGTH)
      }
      const leave = () => {
        xTo(0)
        yTo(0)
      }
      el.addEventListener('pointermove', move)
      el.addEventListener('pointerleave', leave)
      return () => {
        el.removeEventListener('pointermove', move)
        el.removeEventListener('pointerleave', leave)
      }
    },
    { dependencies: [magnetic, reduced] },
  )

  const cls = `${styles.button} ${styles[variant]} ${className}`
  const inner = (
    <>
      <span className={styles.label}>{children}</span>
      <span className={styles.arrow} aria-hidden="true">
        →
      </span>
    </>
  )

  if (to) {
    return (
      <Link ref={ref} to={to} className={cls} data-cursor={cursor} {...rest}>
        {inner}
      </Link>
    )
  }
  if (href) {
    return (
      <a ref={ref} href={href} className={cls} data-cursor={cursor} {...rest}>
        {inner}
      </a>
    )
  }
  return (
    <button ref={ref} type="button" className={cls} data-cursor={cursor} {...rest}>
      {inner}
    </button>
  )
}

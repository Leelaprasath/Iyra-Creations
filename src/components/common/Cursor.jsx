import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useReducedMotion } from '../../store/useAppStore'
import styles from './Cursor.module.css'

const LABELS = { project: 'View', drag: 'Drag' }

/**
 * A subtle follower ring layered on top of the native cursor (the native
 * pointer is never hidden). States come from the closest `data-cursor`
 * attribute: link | cta | project | drag. Fine pointers only.
 */
export function Cursor() {
  const ref = useRef(null)
  const [enabled] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(pointer: fine) and (hover: hover)').matches,
  )
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!enabled) return
    const el = ref.current
    const duration = reduced ? 0 : 0.35
    const xTo = gsap.quickTo(el, 'x', { duration, ease: 'power3.out' })
    const yTo = gsap.quickTo(el, 'y', { duration, ease: 'power3.out' })
    let state = ''

    const onMove = (e) => {
      if (e.pointerType !== 'mouse') return
      el.dataset.visible = 'true'
      xTo(e.clientX)
      yTo(e.clientY)
    }
    const onOver = (e) => {
      const target = e.target.closest?.('[data-cursor], a, button, input, textarea, select, label')
      let next = ''
      if (target) {
        const tag = target.tagName
        next = target.dataset.cursor || (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' ? 'text' : 'link')
      }
      if (next === state) return
      state = next
      el.dataset.state = state
      el.firstChild.textContent = LABELS[state] ?? ''
    }
    const onLeave = () => {
      el.dataset.visible = 'false'
    }
    const onDown = () => el.classList.add(styles.down)
    const onUp = () => el.classList.remove(styles.down)

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerover', onOver)
    document.documentElement.addEventListener('pointerleave', onLeave)
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
    }
  }, [enabled, reduced])

  if (!enabled) return null
  return (
    <div ref={ref} className={styles.cursor} data-visible="false" data-state="" aria-hidden="true">
      <span className={styles.label} />
    </div>
  )
}

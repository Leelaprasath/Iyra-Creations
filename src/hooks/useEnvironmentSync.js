import { useEffect } from 'react'
import { getLayout } from '../config/breakpoints'
import { attachPointer } from '../runtime/pointer'
import { useAppStore } from '../store/useAppStore'

/**
 * Keeps layout, reduced-motion preference and pointer tracking current.
 * Mounted once at the app root.
 */
export function useEnvironmentSync() {
  useEffect(() => {
    const { setLayout, setReducedMotion } = useAppStore.getState()
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncMotion = () => setReducedMotion(mq.matches)
    const syncLayout = () => setLayout(getLayout(window.innerWidth))
    mq.addEventListener('change', syncMotion)
    window.addEventListener('resize', syncLayout, { passive: true })
    const detachPointer = attachPointer()
    return () => {
      mq.removeEventListener('change', syncMotion)
      window.removeEventListener('resize', syncLayout)
      detachPointer()
    }
  }, [])
}

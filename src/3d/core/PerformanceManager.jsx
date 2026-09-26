import { PerformanceMonitor } from '@react-three/drei'
import { lowerTier } from '../../config/quality'
import { useAppStore } from '../../store/useAppStore'

/**
 * Steps the quality tier down when the frame rate stays low. Never steps up
 * (avoids oscillation) and never drops to "fallback" at runtime.
 */
export function PerformanceManager() {
  const onDecline = () => {
    const { tier, setTier, introPhase } = useAppStore.getState()
    // Shader compilation during the intro is not representative.
    if (introPhase !== 'done') return
    const next = lowerTier(tier)
    if (next !== tier) setTier(next)
  }
  return <PerformanceMonitor onDecline={onDecline} flipflops={3} bounds={() => [40, 58]} />
}

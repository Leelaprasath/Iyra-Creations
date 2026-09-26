import { useThree } from '@react-three/fiber'
import { useAppStore } from '../../store/useAppStore'

const FOV_TAN = Math.tan((35 / 2) * (Math.PI / 180))

/**
 * Scale that fits an object of `width` world units into a share of the
 * viewport at `distance` from the camera. Desktop objects sit beside the copy
 * (half the screen); tablet/mobile objects sit above it (full width, but
 * only the ~30% band between the header and the copy).
 */
export function useFitScale({
  width,
  height,
  distance,
  desktopShare = 0.46,
  stackedShare = 0.86,
  stackedHeight = 0.3,
}) {
  const aspect = useThree((s) => s.size.width / s.size.height)
  const layout = useAppStore((s) => s.layout)
  const visibleH = 2 * FOV_TAN * distance
  const visibleW = visibleH * aspect
  if (layout === 'desktop') return Math.min(1, (visibleW * desktopShare) / width, (visibleH * 0.8) / height)
  return Math.min(1, (visibleW * stackedShare) / width, (visibleH * stackedHeight) / height)
}

import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import gsap from 'gsap'

/**
 * Renders the canvas from GSAP's ticker (Canvas uses frameloop="never"), so
 * Lenis, ScrollTrigger, the scroll tracker and WebGL share one RAF and always
 * see the same scroll value within a frame. The ticker callback is added
 * after the smooth-scroll callback, so scroll is updated before rendering.
 */
export function FrameDriver() {
  const advance = useThree((s) => s.advance)
  useEffect(() => {
    const tick = (time) => advance(time)
    gsap.ticker.add(tick)
    return () => gsap.ticker.remove(tick)
  }, [advance])
  return null
}

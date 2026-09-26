import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { BRAND } from '../materials/palette'
import { DAMP, PARALLAX } from '../../config/motion'
import { pointer } from '../../runtime/pointer'
import { useAppStore } from '../../store/useAppStore'

const { damp } = THREE.MathUtils

/**
 * Intentional, cheap lighting shared by every scene:
 * - low ambient fill
 * - neutral key from upper right
 * - IYRA orange rim from behind-left (the signature)
 * - one orange accent point light that travels with the camera and leans
 *   slightly toward the pointer
 */
export function Lighting() {
  const accent = useRef(null)
  const lean = useRef({ x: 0, y: 0 })

  useFrame(({ camera }, delta) => {
    const light = accent.current
    if (!light) return
    const { reducedMotion, layout } = useAppStore.getState()
    const follow = !reducedMotion && layout === 'desktop' && pointer.active
    const l = lean.current
    l.x = damp(l.x, follow ? pointer.x : 0, DAMP.pointer, delta)
    l.y = damp(l.y, follow ? pointer.y : 0, DAMP.pointer, delta)
    light.position.set(
      camera.position.x + 2.5 + l.x * PARALLAX.light,
      camera.position.y + 1.5 + l.y * PARALLAX.light,
      camera.position.z - 6.5,
    )
  })

  return (
    <>
      <ambientLight intensity={0.18} />
      <directionalLight position={[5, 6, 6]} intensity={1.6} color={BRAND.white} />
      <directionalLight position={[-6, 2, -6]} intensity={3.2} color={BRAND.orange} />
      <pointLight ref={accent} intensity={14} distance={16} decay={1.6} color={BRAND.orange} />
    </>
  )
}

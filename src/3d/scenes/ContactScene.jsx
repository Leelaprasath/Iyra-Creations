import { useRef } from 'react'
import { useSceneContext, useSceneFrame } from '../core/SceneContext'
import { BRAND } from '../materials/palette'
import { Glow } from '../objects/Glow'
import { OrbitHalo } from '../particles/OrbitHalo'
import { easeOutCubic, range } from '../../utils/math'

/**
 * The destination. For the final CTA the IYRA orange is at its strongest:
 * a horizon ring of light with particles drawn into it. The contact scene
 * reuses the same light, calmer, behind the form.
 */
export default function ContactScene() {
  const { id } = useSceneContext()
  const isCta = id === 'cta'
  const root = useRef(null)
  const ring = useRef(null)
  const glow = useRef(null)
  const core = useRef(null)

  useSceneFrame((state, delta, frame) => {
    const arrive = easeOutCubic(range(frame.view, 0.1, 0.5)) * frame.presence
    const strength = isCta ? 1 : 0.3
    glow.current.material.uniforms.uIntensity.value = arrive * (isCta ? 0.95 : 0.45)
    ring.current.scale.setScalar(0.7 + arrive * 0.3)
    ring.current.material.opacity = arrive * strength
    core.current.material.uniforms.uIntensity.value = arrive * (isCta ? 1.6 : 0.6)
    if (!frame.reduced) root.current.rotation.z += delta * 0.03
  })

  return (
    <group ref={root} rotation-x={isCta ? -0.15 : -1.1}>
      <Glow ref={glow} size={isCta ? 13 : 10} position={[0, 0, -1.5]} />
      <Glow ref={core} size={3.2} position={[0, 0, -0.2]} />
      <mesh ref={ring}>
        <torusGeometry args={[2.9, 0.022, 12, 220]} />
        <meshBasicMaterial color={BRAND.orangeHot} transparent opacity={0} toneMapped={false} />
      </mesh>
      <OrbitHalo count={isCta ? 900 : 420} radius={3.3} thickness={0.8} seed={isCta ? 51 : 52} />
    </group>
  )
}

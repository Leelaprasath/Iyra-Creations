import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useSceneFrame } from '../core/SceneContext'
import { BRAND } from '../materials/palette'
import { Glow } from '../objects/Glow'
import { edgesOf } from '../utils/geometry'
import { createRandom } from '../../utils/random'

const FRAMES = 18
const DEPTH = 16

/**
 * Selected creations: a corridor of project frames drifting past the camera
 * as the gallery travels — the DOM panels are the content, these are the
 * space they live in. A few frames carry the orange accent.
 */
export default function WorkScene() {
  const root = useRef(null)
  const frames = useRef(null)
  const glow = useRef(null)
  const geometry = useMemo(() => edgesOf(new THREE.PlaneGeometry(1.6, 1)), [])
  useEffect(() => () => geometry.dispose(), [geometry])

  const layout = useMemo(() => {
    const rand = createRandom(19)
    return Array.from({ length: FRAMES }, (_, i) => {
      const angle = i * 2.4
      const r = 3.6 + rand() * 1.8
      return {
        x: Math.cos(angle) * r * 1.4,
        y: Math.sin(angle) * r * 0.7,
        z: -(i / FRAMES) * DEPTH,
        rot: (rand() - 0.5) * 0.5,
        s: 0.6 + rand() * 0.9,
        accent: i % 5 === 2,
      }
    })
  }, [])

  useSceneFrame((state, delta, frame) => {
    const travel = frame.progress * DEPTH * 0.9 + (frame.reduced ? 0 : state.clock.elapsedTime * 0.15)
    frames.current.children.forEach((f, i) => {
      const L = layout[i]
      // Wrap frames through the corridor so it never runs out.
      let z = L.z + travel
      z = ((((z + DEPTH) % DEPTH) + DEPTH) % DEPTH) - DEPTH + 4
      f.position.set(L.x, L.y, z)
      const near = THREE.MathUtils.smoothstep(z, -DEPTH + 4, -2) * (1 - THREE.MathUtils.smoothstep(z, 2, 4))
      f.material.opacity = near * (L.accent ? 0.55 : 0.22) * frame.presence
    })
    glow.current.material.uniforms.uIntensity.value = 0.35 * frame.presence
    root.current.rotation.z = frame.progress * 0.3
  })

  return (
    <group ref={root}>
      <Glow ref={glow} size={14} position={[0, 0, -10]} />
      <group ref={frames}>
        {layout.map((L, i) => (
          <lineSegments key={i} geometry={geometry} rotation-z={L.rot} scale={L.s}>
            <lineBasicMaterial
              color={L.accent ? BRAND.orange : BRAND.white}
              transparent
              opacity={0}
              depthWrite={false}
              toneMapped={!L.accent}
            />
          </lineSegments>
        ))}
      </group>
    </group>
  )
}

import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { DAMP, PARALLAX } from '../../config/motion'
import { intro } from '../../runtime/intro'
import { pointer } from '../../runtime/pointer'
import { easeOutCubic, range } from '../../utils/math'
import { useSceneFrame } from '../core/SceneContext'
import { createEnergyMaterial } from '../materials/createEnergyMaterial'
import { createFresnelGlassMaterial } from '../materials/createFresnelGlassMaterial'
import { BRAND } from '../materials/palette'
import { OrbitHalo } from '../particles/OrbitHalo'
import { edgesOf } from '../utils/geometry'

const { damp } = THREE.MathUtils

/**
 * The IYRA creation core — "an idea becoming a digital experience".
 * Molten orange idea (energy shader) → held by a glass form → structured by a
 * geodesic wireframe → orbited by precise metal rings and a particle halo.
 */
export function CreationCore({ quality }) {
  const root = useRef(null)
  const core = useRef(null)
  const shell = useRef(null)
  const wire = useRef(null)
  const rings = useRef(null)
  const tilt = useRef({ x: 0, y: 0 })

  const detail = Math.round(6 + quality.geometryDetail * 14)
  const energy = useMemo(() => createEnergyMaterial(), [])
  const rimGlass = useMemo(() => createFresnelGlassMaterial(), [])
  const wireGeometry = useMemo(() => edgesOf(new THREE.IcosahedronGeometry(1.62, 1)), [])

  useEffect(() => () => energy.dispose(), [energy])
  useEffect(() => () => rimGlass.dispose(), [rimGlass])
  useEffect(() => () => wireGeometry.dispose(), [wireGeometry])

  useSceneFrame((state, delta, frame) => {
    const motion = frame.reduced ? 0 : 1
    const appear = easeOutCubic(intro.reveal)
    // As the hero scrolls away the structure opens up, handing off to the next scene.
    const exit = range(frame.view, 0.5, 1)

    energy.uniforms.uTime.value += delta * motion
    energy.uniforms.uAmplitude.value = 0.1 + exit * 0.18

    const r = root.current
    r.scale.setScalar(appear * (1 + exit * 0.25))

    const t = tilt.current
    const follow = motion && frame.layout === 'desktop' && pointer.active
    t.x = damp(t.x, follow ? -pointer.y * PARALLAX.objectTilt : 0, DAMP.pointer, delta)
    t.y = damp(t.y, follow ? pointer.x * PARALLAX.objectTilt : 0, DAMP.pointer, delta)
    r.rotation.x = t.x
    r.rotation.y = t.y

    core.current.rotation.y += delta * 0.12 * motion
    wire.current.rotation.y -= delta * 0.05 * motion
    wire.current.rotation.x += delta * 0.03 * motion
    wire.current.scale.setScalar(1 + exit * 0.5)
    shell.current.scale.setScalar(1 + exit * 0.2)

    rings.current.children.forEach((ring, i) => {
      const dir = i % 2 ? -1 : 1
      ring.rotation.z += delta * (0.08 + i * 0.04) * dir * motion
      ring.rotation.x = ring.userData.baseX + exit * 0.6 * dir
      ring.scale.setScalar(0.6 + appear * 0.4 + exit * (0.3 + i * 0.25))
    })
  })

  return (
    <group ref={root} scale={0}>
      <mesh ref={core} material={energy}>
        <icosahedronGeometry args={[0.82, detail]} />
      </mesh>

      <mesh ref={shell}>
        <icosahedronGeometry args={[1.3, 4]} />
        {quality.glass ? (
          <meshPhysicalMaterial
            transmission={1}
            thickness={1.1}
            roughness={0.14}
            ior={1.32}
            attenuationColor={BRAND.orange}
            attenuationDistance={2.4}
            envMapIntensity={1.2}
            clearcoat={1}
            clearcoatRoughness={0.2}
          />
        ) : (
          <primitive object={rimGlass} attach="material" />
        )}
      </mesh>

      <lineSegments ref={wire} geometry={wireGeometry}>
        <lineBasicMaterial color={BRAND.white} transparent opacity={0.22} depthWrite={false} />
      </lineSegments>

      <group ref={rings}>
        <mesh rotation-x={Math.PI / 2.3} userData={{ baseX: Math.PI / 2.3 }}>
          <torusGeometry args={[2.05, 0.014, 12, 200]} />
          <meshStandardMaterial color={BRAND.steel} metalness={1} roughness={0.22} />
        </mesh>
        <mesh rotation-x={Math.PI / 1.7} rotation-y={0.4} userData={{ baseX: Math.PI / 1.7 }}>
          <torusGeometry args={[2.45, 0.006, 8, 220]} />
          <meshBasicMaterial color={BRAND.white} transparent opacity={0.55} />
        </mesh>
        <mesh rotation-x={Math.PI / 2.8} rotation-y={-0.5} userData={{ baseX: Math.PI / 2.8 }}>
          <torusGeometry args={[1.78, 0.01, 8, 200]} />
          <meshBasicMaterial color={BRAND.orange} toneMapped={false} />
        </mesh>
      </group>

      <OrbitHalo count={Math.round(260 + quality.geometryDetail * 440)} radius={2.3} />
    </group>
  )
}

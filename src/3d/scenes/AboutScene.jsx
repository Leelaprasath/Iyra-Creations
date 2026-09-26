import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useSceneFrame } from '../core/SceneContext'
import { BRAND } from '../materials/palette'
import { edgesOf } from '../utils/geometry'
import { easeOutCubic, range } from '../../utils/math'

/** One small form per discipline: design, development, branding, motion, 3D, storytelling. */
const FORMS = [
  () => new THREE.OctahedronGeometry(0.34, 0),
  () => new THREE.BoxGeometry(0.46, 0.46, 0.46),
  () => new THREE.TetrahedronGeometry(0.4, 0),
  () => new THREE.TorusGeometry(0.28, 0.09, 12, 32),
  () => new THREE.IcosahedronGeometry(0.34, 0),
  () => new THREE.ConeGeometry(0.3, 0.55, 5),
]
const RADIUS = 1.8

/** Six disciplines orbiting one idea — the studio as a single system. */
export default function AboutScene() {
  const root = useRef(null)
  const forms = useRef(null)
  const geometries = useMemo(() => FORMS.map((make) => edgesOf(make(), 1)), [])
  useEffect(() => () => geometries.forEach((g) => g.dispose()), [geometries])

  useSceneFrame((state, delta, frame) => {
    const appear = easeOutCubic(range(frame.view, 0.1, 0.45)) * frame.presence
    const t = frame.reduced ? 0 : state.clock.elapsedTime
    forms.current.children.forEach((f, i) => {
      const a = (i / FORMS.length) * Math.PI * 2 + t * 0.12
      f.position.set(Math.cos(a) * RADIUS * appear, Math.sin(a * 2) * 0.25, Math.sin(a) * RADIUS * appear)
      f.rotation.set(t * 0.3 + i, t * 0.4 + i, 0)
      f.material.opacity = appear * (i === 2 ? 1 : 0.6)
    })
    root.current.rotation.x = 0.35
  })

  return (
    <group ref={root}>
      <mesh>
        <icosahedronGeometry args={[0.18, 2]} />
        <meshBasicMaterial color={BRAND.orange} toneMapped={false} />
      </mesh>
      <mesh rotation-x={Math.PI / 2}>
        <torusGeometry args={[RADIUS, 0.004, 6, 160]} />
        <meshBasicMaterial color={BRAND.white} transparent opacity={0.18} />
      </mesh>
      <group ref={forms}>
        {geometries.map((g, i) => (
          <lineSegments key={i} geometry={g}>
            <lineBasicMaterial
              color={i === 2 ? BRAND.orange : BRAND.white}
              transparent
              opacity={0}
              toneMapped={i !== 2}
            />
          </lineSegments>
        ))}
      </group>
    </group>
  )
}

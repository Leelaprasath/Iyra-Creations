import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useSceneFrame } from '../core/SceneContext'
import { BRAND } from '../materials/palette'
import { OrbitHalo } from '../particles/OrbitHalo'
import { easeOutCubic, range } from '../../utils/math'

const COUNT = 5
const RADIUS = 1.9

/**
 * "What we create": the creation core's energy splits into five services —
 * five nodes on one orbit, joined into a single system (pentagon + star).
 */
export default function ServicesScene() {
  const root = useRef(null)
  const nodes = useRef(null)
  const lines = useRef(null)

  const lineGeometry = useMemo(() => {
    const pts = []
    const at = (i) => {
      const a = (i / COUNT) * Math.PI * 2 + Math.PI / 2
      return [Math.cos(a) * RADIUS, Math.sin(a) * RADIUS, 0]
    }
    for (let i = 0; i < COUNT; i++) {
      pts.push(...at(i), ...at((i + 1) % COUNT)) // pentagon
      pts.push(...at(i), ...at((i + 2) % COUNT)) // star
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
    return g
  }, [])
  useEffect(() => () => lineGeometry.dispose(), [lineGeometry])

  useSceneFrame((state, delta, frame) => {
    const appear = easeOutCubic(range(frame.view, 0.15, 0.5)) * frame.presence
    const g = root.current
    if (!frame.reduced) g.rotation.z += delta * 0.06
    g.rotation.x = -0.5 + frame.view * 0.5
    g.scale.setScalar(0.6 + appear * 0.4)
    lines.current.material.opacity = appear * 0.22
    nodes.current.children.forEach((n, i) => {
      const a = (i / COUNT) * Math.PI * 2 + Math.PI / 2
      const r = RADIUS * appear
      n.position.set(Math.cos(a) * r, Math.sin(a) * r, 0)
      n.scale.setScalar(Math.max(0.001, appear))
    })
  })

  return (
    <group ref={root}>
      <lineSegments ref={lines} geometry={lineGeometry}>
        <lineBasicMaterial color={BRAND.white} transparent opacity={0} depthWrite={false} />
      </lineSegments>
      <group ref={nodes}>
        {Array.from({ length: COUNT }, (_, i) => (
          <mesh key={i}>
            <icosahedronGeometry args={[i === 0 ? 0.09 : 0.06, 1]} />
            <meshBasicMaterial color={i === 0 ? BRAND.orange : BRAND.paper} toneMapped={false} />
          </mesh>
        ))}
      </group>
      <mesh>
        <icosahedronGeometry args={[0.24, 2]} />
        <meshStandardMaterial
          color={BRAND.graphite}
          emissive={BRAND.orange}
          emissiveIntensity={0.6}
          roughness={0.4}
          metalness={0.3}
        />
      </mesh>
      <OrbitHalo count={380} radius={RADIUS * 1.15} seed={31} />
    </group>
  )
}

import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { capabilities } from '../../data/capabilities'
import { useAppStore } from '../../store/useAppStore'
import { useSceneFrame } from '../core/SceneContext'
import { BRAND, COLORS } from '../materials/palette'
import { edgesOf } from '../utils/geometry'
import { useFitScale } from '../utils/useFitScale'

const { damp } = THREE.MathUtils
const ORBIT = 2.5
const STEP = (Math.PI * 2) / capabilities.length

const SHAPES = {
  icosahedron: () => new THREE.IcosahedronGeometry(1, 0),
  box: () => new THREE.BoxGeometry(1.3, 1.3, 1.3),
  octahedron: () => new THREE.OctahedronGeometry(1.15, 0),
  dodecahedron: () => new THREE.DodecahedronGeometry(1, 0),
  torusKnot: () => new THREE.TorusKnotGeometry(0.65, 0.2, 120, 16),
  tetrahedron: () => new THREE.TetrahedronGeometry(1.25, 0),
  torus: () => new THREE.TorusGeometry(0.8, 0.28, 24, 64),
  sphere: () => new THREE.IcosahedronGeometry(1, 3),
}

/**
 * "Our creative universe": a central core whose form, light and warmth change
 * with the active capability, orbited by one node per capability. The active
 * node swings to the front. Driven by the Capabilities section (store index).
 */
export default function CapabilitiesScene() {
  const root = useRef(null)
  const cores = useRef(null)
  const orbit = useRef(null)
  const light = useRef(null)
  const warmColor = useMemo(() => new THREE.Color(), [])
  const scale = useFitScale({ width: ORBIT * 2 + 0.6, height: ORBIT * 2, distance: 10, stackedHeight: 0.34 })

  const geometries = useMemo(
    () =>
      capabilities.map((c) => {
        const solid = SHAPES[c.shape]()
        return { solid, edges: edgesOf(solid.clone(), 20) }
      }),
    [],
  )
  useEffect(
    () => () =>
      geometries.forEach((g) => {
        g.solid.dispose()
        g.edges.dispose()
      }),
    [geometries],
  )

  useSceneFrame((state, delta, frame) => {
    const active = useAppStore.getState().activeCapability
    const warmth = capabilities[active].warmth
    const lambda = frame.reduced ? 12 : 5
    const g = root.current
    g.scale.setScalar(scale * (0.85 + 0.15 * frame.presence))

    cores.current.children.forEach((core, i) => {
      const target = i === active ? 1 : 0
      const s = damp(core.scale.x, target, lambda, delta)
      core.scale.setScalar(Math.max(0.0001, s))
      core.visible = s > 0.01
      if (!frame.reduced) {
        core.rotation.y += delta * 0.35
        core.rotation.x += delta * 0.12
      }
    })

    // Bring the active node to the front of the orbit.
    const o = orbit.current
    const targetRot = -active * STEP
    let diff = targetRot - o.rotation.y
    diff = Math.atan2(Math.sin(diff), Math.cos(diff))
    o.rotation.y = damp(o.rotation.y, o.rotation.y + diff, lambda * 0.6, delta)
    o.children.forEach((node, i) => {
      const on = i === active ? 1 : 0
      node.scale.setScalar(damp(node.scale.x, 0.6 + on * 0.9, lambda, delta))
      node.material.color.lerpColors(COLORS.white, COLORS.orange, damp(node.userData.on ?? 0, on, lambda, delta))
      node.userData.on = damp(node.userData.on ?? 0, on, lambda, delta)
    })

    warmColor.lerpColors(COLORS.white, COLORS.orange, warmth)
    light.current.color.lerp(warmColor, 1 - Math.exp(-lambda * delta))
    light.current.intensity = damp(light.current.intensity, 6 + warmth * 10, lambda, delta)
  })

  return (
    <group ref={root}>
      <pointLight ref={light} position={[0, 1.8, 2.4]} intensity={8} distance={9} decay={1.4} />
      <group ref={cores}>
        {geometries.map((g, i) => (
          <group key={capabilities[i].id} scale={i === 0 ? 1 : 0.0001}>
            <mesh geometry={g.solid}>
              <meshPhysicalMaterial
                color={BRAND.graphite}
                metalness={0.85}
                roughness={0.25}
                clearcoat={1}
                clearcoatRoughness={0.3}
                emissive={BRAND.orange}
                emissiveIntensity={0.08 + capabilities[i].warmth * 0.25}
              />
            </mesh>
            <lineSegments geometry={g.edges} scale={1.004}>
              <lineBasicMaterial color={BRAND.orange} transparent opacity={0.8} toneMapped={false} />
            </lineSegments>
          </group>
        ))}
      </group>
      <group ref={orbit} rotation-x={0.28}>
        {capabilities.map((c, i) => (
          <mesh key={c.id} position={[Math.sin(i * STEP) * ORBIT, 0, Math.cos(i * STEP) * ORBIT]}>
            <octahedronGeometry args={[0.09, 0]} />
            <meshBasicMaterial color={BRAND.white} toneMapped={false} />
          </mesh>
        ))}
      </group>
      <mesh rotation-x={Math.PI / 2 + 0.28}>
        <torusGeometry args={[ORBIT, 0.004, 6, 160]} />
        <meshBasicMaterial color={BRAND.white} transparent opacity={0.25} />
      </mesh>
    </group>
  )
}

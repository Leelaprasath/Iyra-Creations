import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useSceneFrame } from '../core/SceneContext'
import { BRAND } from '../materials/palette'
import { Glow } from '../objects/Glow'
import { stageAmounts } from '../objects/staged/driveParts'
import { edgesOf, fibonacciSphere } from '../utils/geometry'
import { useFitScale } from '../utils/useFitScale'
import { lerp } from '../../utils/math'

/** Stages: 0 discover (point) · 1 define (sphere) · 2 design (wireframe) · 3 build (structure) · 4 launch (finished). */
const STAGES = 5
const R = 1.4

/**
 * One object evolves through the whole process: a single point of light →
 * a sphere of possibilities → a wireframe → an engineered structure → a
 * finished, lit object. Each form hands over to the next.
 */
export default function ProcessScene() {
  const root = useRef(null)
  const point = useRef(null)
  const glow = useRef(null)
  const sphere = useRef(null)
  const wire = useRef(null)
  const structure = useRef(null)
  const solid = useRef(null)
  const stages = useMemo(() => new Float32Array(STAGES), [])
  const scale = useFitScale({ width: R * 2.6, height: R * 2.6, distance: 8 })

  const geo = useMemo(() => {
    const dots = new THREE.BufferGeometry()
    dots.setAttribute('position', new THREE.BufferAttribute(fibonacciSphere(700, R), 3))
    return {
      dots,
      wire: edgesOf(new THREE.IcosahedronGeometry(R, 1)),
      struts: edgesOf(new THREE.DodecahedronGeometry(R * 0.62, 0)),
      solid: new THREE.IcosahedronGeometry(R * 0.98, 1),
    }
  }, [])
  useEffect(() => () => Object.values(geo).forEach((g) => g.dispose()), [geo])

  useSceneFrame(
    (state, delta, frame) => {
      const [discover, define, design, build, launch] = stageAmounts(frame.progress, STAGES, stages)
      const p = frame.presence

      point.current.scale.setScalar(Math.max(0.001, (1 - define) * 0.12 + 0.02))
      glow.current.material.uniforms.uIntensity.value = discover * lerp(1, 0.35, define) * p
      sphere.current.scale.setScalar(Math.max(0.001, define))
      sphere.current.material.opacity = define * (1 - design * 0.7) * (1 - launch) * p
      wire.current.material.opacity = design * lerp(0.8, 0.35, launch) * p
      wire.current.scale.setScalar(lerp(0.85, 1.002, design))
      structure.current.children.forEach((m) => {
        m.material.opacity = build * (1 - launch * 0.6) * p
      })
      structure.current.scale.setScalar(lerp(0.4, 1, build))
      solid.current.visible = launch > 0.01
      solid.current.material.opacity = launch * p

      const g = root.current
      if (!frame.reduced) g.rotation.y += delta * 0.18
      g.rotation.x = 0.25
      g.scale.setScalar(scale * (0.9 + 0.1 * p))
    },
    { steps: STAGES - 1 },
  )

  return (
    <group ref={root}>
      <mesh ref={point}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial color={BRAND.orangeHot} toneMapped={false} />
      </mesh>
      <Glow ref={glow} size={3} intensity={0} />
      <points ref={sphere} geometry={geo.dots}>
        <pointsMaterial color={BRAND.white} size={0.03} transparent opacity={0} depthWrite={false} />
      </points>
      <lineSegments ref={wire} geometry={geo.wire}>
        <lineBasicMaterial color={BRAND.orange} transparent opacity={0} depthWrite={false} toneMapped={false} />
      </lineSegments>
      <group ref={structure}>
        <lineSegments geometry={geo.struts}>
          <lineBasicMaterial color={BRAND.white} transparent opacity={0} depthWrite={false} />
        </lineSegments>
        {[0, 1, 2].map((axis) => (
          <mesh key={axis} rotation={[axis === 0 ? Math.PI / 2 : 0, axis === 1 ? Math.PI / 2 : 0, 0]}>
            <torusGeometry args={[R * 0.78, 0.008, 6, 120]} />
            <meshBasicMaterial color={BRAND.steel} transparent opacity={0} depthWrite={false} />
          </mesh>
        ))}
      </group>
      <mesh ref={solid} geometry={geo.solid} visible={false}>
        <meshPhysicalMaterial
          color={BRAND.graphite}
          metalness={0.9}
          roughness={0.22}
          clearcoat={1}
          flatShading
          transparent
          opacity={0}
          emissive={BRAND.orange}
          emissiveIntensity={0.12}
        />
      </mesh>
    </group>
  )
}

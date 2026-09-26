import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useSceneFrame } from '../core/SceneContext'
import { BRAND } from '../materials/palette'
import { stageAmounts } from '../objects/staged/driveParts'
import { createConstructionLines, createGridPoints, createLogoGeometries } from '../objects/logoGeometry'
import { useFitScale } from '../utils/useFitScale'
import { easeInOutCubic, lerp } from '../../utils/math'

/** Stages: 0 grid · 1 geometry · 2 type · 3 symbol · 4 identity. */
const STAGES = 5
const LOGO_W = 4.3
const LOGO_H = 1.7

/**
 * Logo design, shown as the process behind the IYRA mark itself:
 * a point grid → construction geometry drawn line by line → letter outlines
 * → filled symbol → the finished identity, extruded and lit in 3D.
 */
export default function LogoScene() {
  const root = useRef(null)
  const grid = useRef(null)
  const guides = useRef(null)
  const outline = useRef(null)
  const flat = useRef(null)
  const solid = useRef(null)
  const stages = useMemo(() => new Float32Array(STAGES), [])
  const scale = useFitScale({ width: LOGO_W, height: LOGO_H, distance: 8 })

  const geo = useMemo(() => {
    const logo = createLogoGeometries()
    return { ...logo, grid: createGridPoints(), guides: createConstructionLines() }
  }, [])
  useEffect(() => () => Object.values(geo).forEach((g) => g.dispose()), [geo])

  const guideCount = geo.guides.attributes.position.count

  useSceneFrame(
    (state, delta, frame) => {
      stageAmounts(frame.progress, STAGES, stages)
      const [sGrid, sGeom, sType, sSymbol, sIdentity] = stages
      const p = frame.presence

      grid.current.material.opacity = sGrid * lerp(0.7, 0.18, sSymbol) * p
      // Construction lines draw in sequence, then recede once the symbol exists.
      geo.guides.setDrawRange(0, Math.floor((sGeom * guideCount) / 2) * 2)
      guides.current.material.opacity = lerp(0.55, 0.12, sSymbol) * (1 - sIdentity) * p
      outline.current.material.opacity = sType * (1 - sSymbol * 0.8) * p
      flat.current.children.forEach((m) => {
        m.material.opacity = sSymbol * (1 - sIdentity) * p
      })
      const s = solid.current
      s.visible = sIdentity > 0.01
      s.children.forEach((m) => {
        m.material.opacity = sIdentity * p
      })

      // The identity turns to catch the orange rim light.
      const g = root.current
      const turn = easeInOutCubic(sIdentity)
      const idle = frame.reduced ? 0 : Math.sin(state.clock.elapsedTime * 0.5) * 0.08
      g.rotation.y = lerp(0, -0.35, turn) + idle * turn
      g.rotation.x = lerp(0, 0.12, turn)
      g.scale.setScalar(scale * (0.92 + 0.08 * p))
    },
    { steps: STAGES - 1 },
  )

  return (
    <group ref={root}>
      <points ref={grid} geometry={geo.grid}>
        <pointsMaterial color={BRAND.white} size={0.035} transparent opacity={0} depthWrite={false} />
      </points>
      <lineSegments ref={guides} geometry={geo.guides}>
        <lineBasicMaterial color={BRAND.orange} transparent opacity={0} depthWrite={false} toneMapped={false} />
      </lineSegments>
      <lineSegments ref={outline} geometry={geo.outline}>
        <lineBasicMaterial color={BRAND.white} transparent opacity={0} depthWrite={false} />
      </lineSegments>
      <group ref={flat}>
        <mesh geometry={geo.letters}>
          <meshBasicMaterial color={BRAND.paper} transparent opacity={0} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
        <mesh geometry={geo.frame}>
          <meshBasicMaterial color={BRAND.paper} transparent opacity={0} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      </group>
      <group ref={solid} visible={false}>
        <mesh geometry={geo.extruded}>
          <meshStandardMaterial color="#e9e9e9" metalness={0.55} roughness={0.28} transparent opacity={0} />
        </mesh>
      </group>
    </group>
  )
}

import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { BRAND } from '../materials/palette'
import { useSceneFrame } from '../core/SceneContext'
import { driveParts, stageAmounts } from '../objects/staged/driveParts'
import { StagedPart } from '../objects/staged/StagedPart'
import { createCanvasTexture, drawHeroImage } from '../utils/textures'
import { useFitScale } from '../utils/useFitScale'
import { easeInOutCubic, lerp, range } from '../../utils/math'

/** Stages: 0 frame · 1 layout · 2 typography · 3 imagery · 4 interaction · 5 final website. */
const STAGES = 6
const W = 4.4
const H = 2.8
// Interface whites sit just under the bloom threshold: UI reads as surface, not light.
const LINE = BRAND.paper
const MUTED = BRAND.steel

function buildParts(heroImage) {
  const cardsX = [-1.35, 0, 1.35]
  return [
    // 5 · final: the finished page surface (drawn first, behind everything)
    { kind: 'fill', size: [W, H], pos: [0, 0, -0.02], color: '#0c0c0c', stage: 5 },
    // 0 · frame
    { kind: 'line', size: [W, H], pos: [0, 0, 0], color: LINE, opacity: 0.75, stage: 0, grow: 'scale' },
    {
      kind: 'fill',
      size: [W, 0.01],
      pos: [-W / 2, 1.12, 0],
      anchor: 'left',
      color: LINE,
      opacity: 0.5,
      stage: 0,
      grow: 'x',
    },
    { kind: 'circle', size: [0.04], pos: [-2.02, 1.26, 0], color: BRAND.orange, stage: 0 },
    { kind: 'circle', size: [0.04], pos: [-1.9, 1.26, 0], color: LINE, opacity: 0.5, stage: 0 },
    { kind: 'circle', size: [0.04], pos: [-1.78, 1.26, 0], color: LINE, opacity: 0.5, stage: 0 },
    { kind: 'line', size: [1.6, 0.14], pos: [0, 1.26, 0], color: LINE, opacity: 0.35, stage: 0 },
    // 1 · layout (wireframe blocks, gone in the final site)
    {
      kind: 'line',
      size: [4.0, 0.16],
      pos: [0, 0.92, 0],
      color: LINE,
      opacity: 0.45,
      stage: 1,
      layer: 1,
      dimAt: [5, 0],
    },
    {
      kind: 'line',
      size: [1.9, 1.1],
      pos: [-1.0, 0.2, 0],
      color: LINE,
      opacity: 0.45,
      stage: 1,
      layer: 1,
      dimAt: [5, 0],
    },
    {
      kind: 'line',
      size: [1.8, 1.1],
      pos: [1.05, 0.2, 0],
      color: LINE,
      opacity: 0.45,
      stage: 1,
      layer: 1,
      dimAt: [5, 0.12],
    },
    ...cardsX.map((x) => ({
      kind: 'line',
      size: [1.25, 0.62],
      pos: [x, -0.85, 0],
      color: LINE,
      opacity: 0.4,
      stage: 1,
      layer: 1,
      dimAt: [5, 0.15],
    })),
    // 2 · typography
    {
      kind: 'fill',
      size: [0.35, 0.06],
      pos: [-1.95, 0.92, 0],
      anchor: 'left',
      color: LINE,
      stage: 2,
      layer: 2,
      grow: 'x',
    },
    ...[0.9, 1.25, 1.6].map((x) => ({
      kind: 'fill',
      size: [0.22, 0.035],
      pos: [x, 0.92, 0],
      color: MUTED,
      stage: 2,
      layer: 2,
      grow: 'x',
    })),
    {
      kind: 'fill',
      size: [1.6, 0.16],
      pos: [-1.85, 0.52, 0],
      anchor: 'left',
      color: LINE,
      stage: 2,
      layer: 2,
      grow: 'x',
    },
    {
      kind: 'fill',
      size: [1.2, 0.16],
      pos: [-1.85, 0.28, 0],
      anchor: 'left',
      color: LINE,
      stage: 2,
      layer: 2,
      grow: 'x',
    },
    ...[
      [1.5, 0.06],
      [1.35, -0.04],
      [0.9, -0.14],
    ].map(([w, y]) => ({
      kind: 'fill',
      size: [w, 0.035],
      pos: [-1.85, y, 0],
      anchor: 'left',
      color: MUTED,
      opacity: 0.7,
      stage: 2,
      layer: 2,
      grow: 'x',
    })),
    ...cardsX.map((x) => ({
      kind: 'fill',
      size: [0.7, 0.04],
      pos: [x - 0.52, -1.02, 0],
      anchor: 'left',
      color: MUTED,
      stage: 2,
      layer: 2,
      grow: 'x',
    })),
    // 3 · imagery
    {
      kind: 'fill',
      size: [1.8, 1.1],
      pos: [1.05, 0.2, 0],
      color: '#ffffff',
      map: heroImage,
      stage: 3,
      layer: 3,
      grow: 'scale',
    },
    ...cardsX.map((x, i) => ({
      kind: 'fill',
      size: [1.25, 0.36],
      pos: [x, -0.71, 0],
      color: i === 1 ? BRAND.orange : BRAND.graphite,
      opacity: i === 1 ? 0.85 : 1,
      stage: 3,
      layer: 3,
      grow: 'y',
    })),
    // 4 · interaction
    { kind: 'fill', size: [0.5, 0.14], pos: [-1.6, -0.36, 0], color: BRAND.orange, stage: 4, layer: 4, grow: 'scale' },
  ]
}

/** Cursor arrow (pointing up-left), in local units. */
function createCursorShape() {
  const s = new THREE.Shape()
  s.moveTo(0, 0)
  s.lineTo(0, -0.22)
  s.lineTo(0.06, -0.16)
  s.lineTo(0.11, -0.26)
  s.lineTo(0.14, -0.245)
  s.lineTo(0.095, -0.15)
  s.lineTo(0.17, -0.15)
  s.closePath()
  return new THREE.ShapeGeometry(s)
}

const BUTTON = new THREE.Vector2(-1.55, -0.38)
const CURSOR_START = new THREE.Vector2(0.4, -0.2)

/**
 * Website development: a wireframe browser becomes a finished site —
 * frame → layout → typography → imagery → interaction → final website.
 * Mid-build the layers separate in depth (an exploded view of the craft),
 * then collapse flat into one polished page.
 */
export default function WebsiteScene() {
  const root = useRef(null)
  const parts = useRef(null)
  const cursor = useRef(null)
  const ripple = useRef(null)
  const stages = useMemo(() => new Float32Array(STAGES), [])
  const scale = useFitScale({ width: W, height: H, distance: 8.5 })

  const heroImage = useMemo(() => createCanvasTexture(256, 160, drawHeroImage), [])
  const specs = useMemo(() => buildParts(heroImage), [heroImage])
  const cursorGeometry = useMemo(() => createCursorShape(), [])
  useEffect(() => () => heroImage.dispose(), [heroImage])
  useEffect(() => () => cursorGeometry.dispose(), [cursorGeometry])

  useSceneFrame(
    (state, delta, frame) => {
      stageAmounts(frame.progress, STAGES, stages)
      const final = stages[5]
      const explode = stages[1] * (1 - final)
      driveParts(parts.current, { stages, explode, presence: frame.presence, explodeDepth: 0.32 })

      // Exploded three-quarter view while building; faces the viewer when finished.
      const g = root.current
      g.rotation.y = lerp(-0.5, -0.14, easeInOutCubic(final))
      g.rotation.x = lerp(0.2, 0.04, easeInOutCubic(final))
      g.scale.setScalar(scale * (0.9 + 0.1 * frame.presence))

      // Interaction beat: cursor glides to the button and clicks.
      const interact = stages[4]
      const travel = easeInOutCubic(range(interact, 0.1, 0.8))
      const c = cursor.current
      c.position.set(
        lerp(CURSOR_START.x, BUTTON.x, travel),
        lerp(CURSOR_START.y, BUTTON.y, travel),
        4 * 0.32 * explode + 0.02,
      )
      c.material.opacity = interact * (1 - final * 0.7) * frame.presence
      const click = range(interact, 0.8, 1)
      const r = ripple.current
      r.position.set(BUTTON.x, BUTTON.y, c.position.z - 0.01)
      r.scale.setScalar(0.4 + click * 1.2)
      r.material.opacity = click * (1 - click) * 2.5 * frame.presence
    },
    { steps: STAGES - 1 },
  )

  return (
    <group ref={root}>
      <group ref={parts}>
        {specs.map((spec, i) => (
          <StagedPart key={i} spec={spec} order={i} />
        ))}
      </group>
      <mesh ref={cursor} geometry={cursorGeometry}>
        <meshBasicMaterial color={BRAND.white} transparent opacity={0} depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh ref={ripple}>
        <ringGeometry args={[0.16, 0.18, 40]} />
        <meshBasicMaterial color={BRAND.orange} transparent opacity={0} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  )
}

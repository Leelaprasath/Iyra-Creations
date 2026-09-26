import { useMemo, useRef } from 'react'
import { useSceneFrame } from '../core/SceneContext'
import { BRAND } from '../materials/palette'
import { driveParts, stageAmounts } from '../objects/staged/driveParts'
import { StagedPart } from '../objects/staged/StagedPart'
import { useFitScale } from '../utils/useFitScale'
import { easeInOutCubic, lerp, range } from '../../utils/math'
import { createRandom } from '../../utils/random'

/** Stages: 0 idea · 1 system · 2 interface · 3 product · 4 scale. */
const STAGES = 5
const W = 4.4
const H = 2.8
const LINE = BRAND.paper
const CHART = [0.35, 0.55, 0.42, 0.7, 0.5, 0.82, 0.64, 0.95]

function buildParts() {
  const rand = createRandom(42)
  // Every interface element starts somewhere in the idea-space around the product.
  const scatter = (i) => ({
    pos: [(rand() - 0.5) * 5.2, (rand() - 0.5) * 3.4, -1 - rand() * 2.5],
    rot: [(rand() - 0.5) * 1.4, (rand() - 0.5) * 1.8, (rand() - 0.5) * 0.9],
    delay: i * 0.012,
  })
  const parts = []
  let i = 0
  const add = (spec, scattered = true) => {
    const s = scattered ? scatter(i) : null
    parts.push(s ? { ...spec, from: { pos: s.pos, rot: s.rot }, delay: s.delay } : spec)
    i += 1
  }

  // 4 · scale — the product echoing outward
  add(
    { kind: 'line', size: [W, H], pos: [0.7, 0.55, -1.4], color: BRAND.orange, opacity: 0.35, stage: 4, grow: 'scale' },
    false,
  )
  add(
    { kind: 'line', size: [W, H], pos: [0.35, 0.28, -0.7], color: LINE, opacity: 0.3, stage: 4, grow: 'scale' },
    false,
  )
  // 3 · product surface
  add({ kind: 'fill', size: [W, H], pos: [0, 0, -0.03], color: '#0c0c0c', stage: 3 }, false)
  add({ kind: 'line', size: [W, H], pos: [0, 0, -0.02], color: LINE, opacity: 0.5, stage: 3, grow: 'scale' }, false)
  // 0 · the idea: a single point of light
  add({ kind: 'circle', size: [0.09], pos: [0, 0, 0.2], color: BRAND.orange, stage: 0, dimAt: [2, 0] }, false)
  add(
    { kind: 'ring', size: [0.22], pos: [0, 0, 0.2], color: BRAND.orange, opacity: 0.5, stage: 0, dimAt: [1, 0] },
    false,
  )

  // 1 · system (structure) → 2 · interface (surfaces)
  add({ kind: 'fill', size: [0.8, H], pos: [-1.8, 0, 0], color: BRAND.graphite, stage: 2 })
  for (let k = 0; k < 5; k++)
    add({
      kind: 'fill',
      size: [0.46, 0.035],
      pos: [-1.9, 0.9 - k * 0.24, 0.01],
      color: k === 1 ? BRAND.orange : BRAND.steel,
      stage: 2,
    })
  add({ kind: 'fill', size: [3.6, 0.28], pos: [0.4, 1.26, 0], color: BRAND.graphite, stage: 2 })
  const cards = [-0.78, 0.4, 1.58]
  cards.forEach((x, k) => {
    add({ kind: 'line', size: [1.05, 0.6], pos: [x, 0.66, 0.01], color: LINE, opacity: 0.4, stage: 1 })
    add({ kind: 'fill', size: [1.05, 0.6], pos: [x, 0.66, 0], color: BRAND.graphite, stage: 2 })
    add({
      kind: 'fill',
      size: [0.46, 0.1],
      pos: [x - 0.35, 0.62, 0.02],
      anchor: 'left',
      color: k === 0 ? BRAND.orange : LINE,
      stage: 3,
      grow: 'x',
    })
    add({
      kind: 'fill',
      size: [0.3, 0.03],
      pos: [x - 0.35, 0.82, 0.02],
      anchor: 'left',
      color: BRAND.steel,
      stage: 2,
      grow: 'x',
    })
  })
  add({ kind: 'line', size: [2.3, 1.3], pos: [-0.18, -0.55, 0.01], color: LINE, opacity: 0.4, stage: 1 })
  CHART.forEach((h, k) =>
    add({
      kind: 'fill',
      size: [0.16, h * 1.0],
      pos: [-1.1 + k * 0.265, -1.12, 0.02],
      anchor: 'bottom',
      color: k === CHART.length - 1 ? BRAND.orange : '#3a3a3a',
      stage: 3,
      grow: 'y',
    }),
  )
  for (let k = 0; k < 4; k++) {
    add({ kind: 'fill', size: [1.1, 0.13], pos: [1.58, 0.05 - k * 0.26, 0], color: BRAND.graphite, stage: 2 })
    add({
      kind: 'fill',
      size: [0.5, 0.03],
      pos: [1.2, 0.05 - k * 0.26, 0.01],
      anchor: 'left',
      color: BRAND.steel,
      stage: 3,
      grow: 'x',
    })
  }
  return parts
}

/**
 * SaaS product development: one idea (a point of light) spawns a system of
 * interface elements floating in space, which assemble into a working
 * dashboard — then the product echoes outward to show scale.
 */
export default function SaaSScene() {
  const root = useRef(null)
  const parts = useRef(null)
  const stages = useMemo(() => new Float32Array(STAGES), [])
  const specs = useMemo(() => buildParts(), [])
  const scale = useFitScale({ width: W + 0.8, height: H + 0.6, distance: 8.5 })

  useSceneFrame(
    (state, delta, frame) => {
      stageAmounts(frame.progress, STAGES, stages)
      const assemble = easeInOutCubic(range(frame.progress, 0.18, 0.66))
      driveParts(parts.current, { stages, assemble, presence: frame.presence })
      const g = root.current
      g.rotation.y = lerp(0.45, 0.16, assemble) + stages[4] * -0.1
      g.rotation.x = lerp(0.12, 0.06, assemble)
      g.scale.setScalar(scale * (0.9 + 0.1 * frame.presence))
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
    </group>
  )
}

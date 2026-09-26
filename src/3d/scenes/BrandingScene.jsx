import { useEffect, useMemo, useRef } from 'react'
import { useSceneFrame } from '../core/SceneContext'
import { BRAND } from '../materials/palette'
import { createBrandTextures, TILE_ORDER, TILE_STAGE } from '../objects/brandTiles'
import { driveParts, stageAmounts } from '../objects/staged/driveParts'
import { StagedPart } from '../objects/staged/StagedPart'
import { useFitScale } from '../utils/useFitScale'
import { easeInOutCubic, lerp } from '../../utils/math'
import { createRandom } from '../../utils/random'

/** Stages: 0 mark · 1 colour · 2 typography · 3 pattern · 4 touchpoints · 5 ecosystem. */
const STAGES = 6
const TILE = [1.05, 1.3]
const COLS = [-1.725, -0.575, 0.575, 1.725]
const ROWS = [0.7, -0.7]
const BOARD = [4.75, 3.05]

function buildParts(textures) {
  const rand = createRandom(7)
  const parts = [
    // 5 · ecosystem — the board that holds the whole identity
    { kind: 'fill', size: BOARD, pos: [0, 0, -0.04], color: '#070707', stage: 5 },
    { kind: 'line', size: BOARD, pos: [0, 0, -0.03], color: BRAND.orange, opacity: 0.6, stage: 5, grow: 'scale' },
  ]
  TILE_ORDER.forEach((key, i) => {
    const col = i % 4
    const row = Math.floor(i / 4)
    // Designed pieces float in a loose constellation until the system locks together.
    const angle = (i / TILE_ORDER.length) * Math.PI * 2 + 0.4
    parts.push({
      kind: 'fill',
      size: TILE,
      pos: [COLS[col], ROWS[row], 0],
      color: '#ffffff',
      map: textures[key],
      stage: TILE_STAGE[key],
      grow: 'scale',
      from: {
        pos: [Math.cos(angle) * 2.6, Math.sin(angle) * 1.5, -0.6 - rand() * 1.6],
        rot: [(rand() - 0.5) * 0.7, (rand() - 0.5) * 1.1, (rand() - 0.5) * 0.4],
      },
      delay: i * 0.03,
    })
  })
  return parts
}

/**
 * Complete branding: each part of an identity is designed in turn — mark,
 * colour, typography, pattern, touchpoints — floating in one shared space,
 * then everything locks into a single brand board: a recognizable world.
 */
export default function BrandingScene() {
  const root = useRef(null)
  const parts = useRef(null)
  const stages = useMemo(() => new Float32Array(STAGES), [])
  const textures = useMemo(() => createBrandTextures(), [])
  const specs = useMemo(() => buildParts(textures), [textures])
  const scale = useFitScale({ width: BOARD[0] + 1, height: BOARD[1] + 0.6, distance: 10 })
  useEffect(() => () => Object.values(textures).forEach((t) => t.dispose()), [textures])

  useSceneFrame(
    (state, delta, frame) => {
      stageAmounts(frame.progress, STAGES, stages)
      const assemble = easeInOutCubic(stages[5])
      driveParts(parts.current, { stages, assemble, presence: frame.presence })
      const g = root.current
      const drift = frame.reduced ? 0 : Math.sin(state.clock.elapsedTime * 0.3) * 0.06
      g.rotation.y = lerp(0.35 + drift, 0.12, assemble)
      g.rotation.x = lerp(0.1, 0.04, assemble)
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

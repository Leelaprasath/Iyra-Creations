import * as THREE from 'three'
import { clamp, easeOutCubic, lerp, range } from '../../../utils/math'

const { damp } = THREE.MathUtils
const EPS = 0.001

/**
 * Per-stage reveal amounts for `count` stages from a 0..1 progress value.
 * Stage i builds inside its own slot [i/count, (i+1)/count) — the slot in
 * which the DOM stage rail highlights it — so words and visuals agree.
 * Stage 0 starts early so the object is never empty when the chapter pins.
 */
export function stageAmounts(progress, count, out) {
  for (let i = 0; i < count; i++) {
    const start = i === 0 ? -0.5 : i - 0.1
    out[i] = easeOutCubic(range(progress, start / count, (i + 0.7) / count))
  }
  return out
}

/**
 * Applies stage progress to every StagedPart under `root`.
 * options:
 *   stages     Float32Array of per-stage amounts (0..1)
 *   explode    0..1  depth separation of layers (exploded view)
 *   assemble   0..1  scattered `from` transform → assembled position
 *   presence   0..1  scene presence (fades everything out as the camera leaves)
 *   delta      frame delta for damping (0 = immediate)
 */
export function driveParts(root, { stages, explode = 0, assemble = 1, presence = 1, delta = 0, explodeDepth = 0.35 }) {
  const children = root.children
  for (let c = 0; c < children.length; c++) {
    const obj = children[c]
    const spec = obj.userData.spec
    if (!spec) continue
    const appear = stages[spec.stage] ?? 1
    let opacity = (spec.opacity ?? 1) * appear
    if (spec.dimAt) opacity = lerp(opacity, spec.dimAt[1] * appear, stages[spec.dimAt[0]] ?? 0)
    opacity *= presence

    const grow = spec.grow ?? 'fade'
    const s = grow === 'fade' ? 1 : Math.max(EPS, appear)
    obj.scale.set(grow === 'y' ? 1 : s, grow === 'x' ? 1 : s, 1)
    if (grow === 'fade') obj.scale.setScalar(0.94 + 0.06 * appear)

    const [x, y, z] = spec.pos
    const depth = z + (spec.layer ?? 0) * explodeDepth * explode
    if (spec.from) {
      const a = clamp(assemble * 1.15 - (spec.delay ?? 0))
      const [fx, fy, fz] = spec.from.pos
      const [rx = 0, ry = 0, rz = 0] = spec.from.rot ?? []
      const e = easeOutCubic(a)
      obj.position.set(lerp(fx, x, e), lerp(fy, y, e), lerp(fz, depth, e))
      obj.rotation.set(rx * (1 - e), ry * (1 - e), rz * (1 - e))
    } else {
      obj.position.set(x, y, delta ? damp(obj.position.z, depth, 6, delta) : depth)
    }

    obj.material.opacity = opacity
    obj.visible = opacity > 0.004
  }
}

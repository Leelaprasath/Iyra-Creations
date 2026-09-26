import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { edgesOf } from '../../utils/geometry'

/**
 * One piece of a staged 3D composition (browser, dashboard, brand board…).
 * Parts render in array order (renderOrder), so later specs always draw on
 * top of earlier ones regardless of transparency sorting. Purely declarative: `spec` describes shape and timing, and the parent's
 * `driveParts()` animates every part each frame from stage progress.
 *
 * spec: {
 *   kind: 'fill' | 'line' | 'circle' | 'ring'
 *   size: [w, h]  (circle/ring: [radius])
 *   pos: [x, y, z]      assembled position
 *   color, opacity      max opacity (default 1)
 *   anchor: 'center' | 'left' | 'bottom'   growth origin for grow: 'x' / 'y'
 *   stage: n            stage index in which the part appears
 *   grow: 'fade' | 'scale' | 'x' | 'y'
 *   layer: n            depth multiplier for exploded views
 *   from: { pos, rot }  scattered start, used by assembly progress
 *   delay: 0..1         assembly stagger for parts that have a scattered start
 *   dimAt: [stage, opacity]  fade down once a later stage arrives
 *   map: THREE.Texture  optional texture for fills
 * }
 */
export function StagedPart({ spec, order = 0 }) {
  const { kind, size, anchor = 'center', color = '#ffffff', map } = spec

  const geometry = useMemo(() => {
    let g
    if (kind === 'circle') g = new THREE.CircleGeometry(size[0], 32)
    else if (kind === 'ring') g = new THREE.RingGeometry(size[0] * 0.82, size[0], 48)
    else g = new THREE.PlaneGeometry(size[0], size[1])
    if (anchor === 'left') g.translate(size[0] / 2, 0, 0)
    if (anchor === 'bottom') g.translate(0, size[1] / 2, 0)
    return kind === 'line' ? edgesOf(g) : g
  }, [kind, size, anchor])

  const material = useMemo(() => {
    const params = { color, transparent: true, opacity: 0, depthWrite: false, toneMapped: kind === 'fill' && !!map }
    if (kind === 'line') return new THREE.LineBasicMaterial(params)
    return new THREE.MeshBasicMaterial({ ...params, map: map ?? null, side: THREE.DoubleSide })
  }, [kind, color, map])

  useEffect(() => () => geometry.dispose(), [geometry])
  useEffect(() => () => material.dispose(), [material])

  const Tag = kind === 'line' ? 'lineSegments' : 'mesh'
  return <Tag geometry={geometry} material={material} position={spec.pos} renderOrder={order} userData={{ spec }} />
}

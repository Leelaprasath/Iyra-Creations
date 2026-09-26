import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js'
import { LOGO_PARTS } from '../../brand/logo'

/** SVG units → world units. The logo frame becomes ~4.1 × 1.3 world units. */
export const LOGO_SCALE = 0.01
/** Visual centre of the frame in SVG units. */
export const LOGO_CENTER = [255, 249]

const LETTERS = ['I', 'Y', 'R', 'A']

// SVG is y-down. Mirroring Y alone would flip triangle winding (faces would
// point away from the camera), so Z is mirrored too: extrusions grow into -z
// and the front cap stays at z = 0 facing the viewer.
function toWorld(geometry) {
  geometry.scale(LOGO_SCALE, -LOGO_SCALE, -LOGO_SCALE)
  geometry.translate(-LOGO_CENTER[0] * LOGO_SCALE, LOGO_CENTER[1] * LOGO_SCALE, 0)
  return geometry
}

/** Maps an SVG-space point into world space (same transform as the geometry). */
export function logoPoint(x, y) {
  return [(x - LOGO_CENTER[0]) * LOGO_SCALE, -(y - LOGO_CENTER[1]) * LOGO_SCALE]
}

function shapesFor(ids) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg">${LOGO_PARTS.filter((p) => ids.includes(p.id))
    .map((p) => `<path fill-rule="evenodd" d="${p.d}"/>`)
    .join('')}</svg>`
  return new SVGLoader().parse(svg).paths.flatMap((path) => path.toShapes(true))
}

/**
 * Geometry for the Logo Design scene, all built from the brand paths:
 * flat fills (letters, frame), outlines, and an extruded 3D identity.
 * The caller disposes everything returned.
 */
export function createLogoGeometries() {
  const letterShapes = shapesFor(LETTERS)
  const frameShapes = shapesFor(['frameLeft', 'frameRight'])

  const letters = toWorld(new THREE.ShapeGeometry(letterShapes))
  const frame = toWorld(new THREE.ShapeGeometry(frameShapes))
  const outline = new THREE.EdgesGeometry(letters)

  const extrudeOpts = {
    depth: 14,
    bevelEnabled: true,
    bevelThickness: 2.5,
    bevelSize: 1.2,
    bevelSegments: 2,
    curveSegments: 12,
  }
  const extruded = toWorld(
    mergeGeometries([
      new THREE.ExtrudeGeometry(letterShapes, extrudeOpts),
      new THREE.ExtrudeGeometry(frameShapes, extrudeOpts),
    ]),
  )
  extruded.computeVertexNormals()

  return { letters, frame, outline, extruded }
}

/** Construction guides (baselines, stems, bowl circle, diagonals) as line-segment pairs in world space. */
export function createConstructionLines() {
  const segs = []
  const line = (x1, y1, x2, y2) => segs.push(...logoPoint(x1, y1), 0, ...logoPoint(x2, y2), 0)
  ;[185, 206, 246, 264, 305, 313].forEach((y) => line(28, y, 482, y))
  ;[76, 102, 147, 173, 219, 245, 327, 426].forEach((x) => line(x, 168, x, 330))
  // Y arms and A legs, extended past the letters.
  line(92, 180, 175, 273)
  line(228, 180, 145, 273)
  line(318, 327, 372, 195)
  line(436, 327, 381, 195)
  // R bowl circle
  const [cx, cy, r] = [272, 236, 38]
  for (let i = 0; i < 48; i++) {
    const a1 = (i / 48) * Math.PI * 2
    const a2 = ((i + 1) / 48) * Math.PI * 2
    line(cx + Math.cos(a1) * r, cy + Math.sin(a1) * r, cx + Math.cos(a2) * r, cy + Math.sin(a2) * r)
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(segs, 3))
  return g
}

/** Regular grid of points covering the logo's bounding area. */
export function createGridPoints(cols = 23, rows = 9) {
  const pts = []
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      pts.push(...logoPoint(28 + (i / (cols - 1)) * 454, 168 + (j / (rows - 1)) * 162), 0)
    }
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
  return g
}

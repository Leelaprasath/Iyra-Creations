import * as THREE from 'three'

/** Edge-only geometry from a source geometry; the source is disposed immediately. */
export function edgesOf(source, thresholdAngle = 1) {
  const edges = new THREE.EdgesGeometry(source, thresholdAngle)
  source.dispose()
  return edges
}

/** Fibonacci-sphere points: evenly distributed positions on a sphere. */
export function fibonacciSphere(count, radius = 1) {
  const out = new Float32Array(count * 3)
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / Math.max(count - 1, 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const theta = golden * i
    out[i * 3] = Math.cos(theta) * r * radius
    out[i * 3 + 1] = y * radius
    out[i * 3 + 2] = Math.sin(theta) * r * radius
  }
  return out
}

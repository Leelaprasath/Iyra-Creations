import { useEffect, useMemo, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { COLORS } from '../materials/palette'
import { createRandom } from '../../utils/random'
import { loadTextFont, sampleText } from './sampleText'
import vertexShader from '../shaders/particleText.vert.glsl?raw'
import fragmentShader from '../shaders/particleText.frag.glsl?raw'

const defaultSampler = (opts) => sampleText(opts)

/**
 * Reusable particle typography engine (intro logo, name reveals).
 * Samples `lines` of text by default; pass `sampler` (e.g. sampleLogo bound to
 * the brand geometry) to form any other shape with the same shader.
 *
 * All motion happens in the vertex shader; the caller drives it by writing
 * uniforms inside `drive(uniforms, state, delta)` every frame:
 *   uForm      0..1  particles travel from scattered start → glyph targets
 *   uReveal    0..N  letters allowed to form (N = letter count; use a large value for "all")
 *   uDisperse  0..1  release outward and fade
 *   uDust      0..1  faint visibility of unformed particles ("darkness, tiny particles")
 *   uAlpha     0..1  master opacity
 *
 * `drive` also receives the text sample (e.g. sample.letterCount) as its 4th argument.
 */
export function ParticleText({
  lines,
  sampler = defaultSampler,
  width = 4,
  step = 3,
  maxPoints = 6000,
  scatter = 6,
  size = 1,
  color = COLORS.white,
  accent = COLORS.orange,
  seed = 5,
  drive,
}) {
  const dpr = useThree((s) => s.viewport.dpr)
  const [sample, setSample] = useState(null)
  const key = JSON.stringify(lines)

  useEffect(() => {
    let cancelled = false
    loadTextFont().then(() => {
      if (!cancelled) setSample(sampler({ lines: JSON.parse(key ?? 'null'), width, step, maxPoints, seed }))
    })
    return () => {
      cancelled = true
    }
  }, [key, sampler, width, step, maxPoints, seed])

  const geometry = useMemo(() => {
    if (!sample) return null
    const rand = createRandom(seed + 7)
    const { count, targets, letters } = sample
    const starts = new Float32Array(count * 3)
    const randoms = new Float32Array(count * 4)
    const v = new THREE.Vector3()
    for (let i = 0; i < count; i++) {
      // Start on a loose, deep shell so particles converge from the dark.
      v.set(rand() * 2 - 1, rand() * 2 - 1, rand() * 2 - 1)
        .normalize()
        .multiplyScalar(scatter * (0.35 + rand() * 0.65))
      starts[i * 3] = v.x
      starts[i * 3 + 1] = v.y * 0.6
      starts[i * 3 + 2] = v.z - scatter * 0.4
      for (let k = 0; k < 4; k++) randoms[i * 4 + k] = rand()
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(targets, 3))
    g.setAttribute('aStart', new THREE.BufferAttribute(starts, 3))
    g.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 4))
    g.setAttribute('aLetter', new THREE.BufferAttribute(letters, 1))
    return g
  }, [sample, scatter, seed])

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uMotion: { value: 1 },
          uForm: { value: 0 },
          uReveal: { value: 1000 },
          uDisperse: { value: 0 },
          uDust: { value: 0 },
          uAlpha: { value: 1 },
          uSize: { value: size },
          uPixelRatio: { value: 1 },
          uColor: { value: color.clone() },
          uAccent: { value: accent.clone() },
        },
      }),
    [size, color, accent],
  )

  useEffect(() => () => geometry?.dispose(), [geometry])
  useEffect(() => () => material.dispose(), [material])

  useFrame((state, delta) => {
    const u = material.uniforms
    u.uTime.value += delta
    u.uPixelRatio.value = dpr
    drive?.(u, state, delta, sample)
  })

  if (!geometry) return null
  return <points geometry={geometry} material={material} frustumCulled={false} />
}

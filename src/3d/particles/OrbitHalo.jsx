import { useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useAppStore } from '../../store/useAppStore'
import { createRandom } from '../../utils/random'
import { COLORS } from '../materials/palette'
import vertexShader from '../shaders/orbitHalo.vert.glsl?raw'
import fragmentShader from '../shaders/particleField.frag.glsl?raw'

/** A flattened disc of particles orbiting in the vertex shader (Keplerian: inner is faster). */
export function OrbitHalo({ count = 500, radius = 2.2, thickness = 0.5, seed = 21 }) {
  const dpr = useThree((s) => s.viewport.dpr)

  const geometry = useMemo(() => {
    const rand = createRandom(seed)
    const positions = new Float32Array(count * 3)
    const randoms = new Float32Array(count * 4)
    for (let i = 0; i < count; i++) {
      const r = radius * (0.75 + rand() * 0.6)
      const a = rand() * Math.PI * 2
      positions[i * 3] = Math.cos(a) * r
      positions[i * 3 + 1] = (rand() - 0.5) * thickness * 0.3
      positions[i * 3 + 2] = Math.sin(a) * r
      for (let k = 0; k < 4; k++) randoms[i * 4 + k] = rand()
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    g.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 4))
    return g
  }, [count, radius, thickness, seed])

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
          uPixelRatio: { value: 1 },
          uSize: { value: 1.6 },
          uColor: { value: COLORS.white },
          uAccent: { value: COLORS.orange },
        },
      }),
    [],
  )

  useEffect(() => () => geometry.dispose(), [geometry])
  useEffect(() => () => material.dispose(), [material])

  useFrame((_, delta) => {
    if (!useAppStore.getState().reducedMotion) material.uniforms.uTime.value += delta
    material.uniforms.uPixelRatio.value = dpr
  })

  return <points geometry={geometry} material={material} rotation-x={0.35} frustumCulled={false} />
}

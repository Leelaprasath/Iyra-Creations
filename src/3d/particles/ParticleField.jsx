import { useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { SCENES, sceneY } from '../../config/scenes'
import { useAppStore } from '../../store/useAppStore'
import { COLORS } from '../materials/palette'
import { createRandom } from '../../utils/random'
import vertexShader from '../shaders/particleField.vert.glsl?raw'
import fragmentShader from '../shaders/particleField.frag.glsl?raw'

const SPREAD_X = 14
const SPREAD_Z = [-12, 3]
const MARGIN_Y = 10

/**
 * Ambient dust spanning the whole journey — one draw call, animated in the
 * vertex shader. Count comes from the quality tier.
 */
export function ParticleField({ count }) {
  const dpr = useThree((s) => s.viewport.dpr)

  const geometry = useMemo(() => {
    const rand = createRandom(11)
    const top = MARGIN_Y
    const bottom = sceneY(SCENES.length - 1) - MARGIN_Y
    const positions = new Float32Array(count * 3)
    const randoms = new Float32Array(count * 4)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (rand() - 0.5) * 2 * SPREAD_X
      positions[i * 3 + 1] = bottom + rand() * (top - bottom)
      positions[i * 3 + 2] = SPREAD_Z[0] + rand() * (SPREAD_Z[1] - SPREAD_Z[0])
      for (let k = 0; k < 4; k++) randoms[i * 4 + k] = rand()
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    g.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 4))
    return g
  }, [count])

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
          uPixelRatio: { value: 1 },
          uSize: { value: 2.2 },
          uColor: { value: COLORS.white },
          uAccent: { value: COLORS.orange },
        },
      }),
    [],
  )

  useEffect(() => () => geometry.dispose(), [geometry])
  useEffect(() => () => material.dispose(), [material])

  useFrame((state, delta) => {
    const u = material.uniforms
    const reduced = useAppStore.getState().reducedMotion
    u.uMotion.value = reduced ? 0 : 1
    u.uTime.value += delta
    u.uPixelRatio.value = dpr
  })

  return <points geometry={geometry} material={material} frustumCulled={false} />
}

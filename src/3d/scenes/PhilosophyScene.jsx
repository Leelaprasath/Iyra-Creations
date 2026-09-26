import { useEffect, useMemo, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { pointer } from '../../runtime/pointer'
import { useTier } from '../../store/useAppStore'
import { useSceneFrame } from '../core/SceneContext'
import { COLORS } from '../materials/palette'
import vertexShader from '../shaders/waveField.vert.glsl?raw'
import fragmentShader from '../shaders/particleField.frag.glsl?raw'

const { damp } = THREE.MathUtils

/**
 * "Design should be felt, not just seen." A field of points behaving like a
 * surface of fabric: slow waves roll through it and it leans toward the
 * pointer, warming to orange at the crests. Pure vertex shader.
 */
export default function PhilosophyScene() {
  const tier = useTier()
  const dpr = useThree((s) => s.viewport.dpr)
  const points = useRef(null)
  const lean = useRef({ x: 0, y: 0 })
  const [cols, rows] = tier === 'high' ? [150, 70] : tier === 'medium' ? [110, 50] : [70, 32]

  const geometry = useMemo(() => {
    const positions = new Float32Array(cols * rows * 3)
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const k = (j * cols + i) * 3
        positions[k] = (i / (cols - 1) - 0.5) * 16
        positions[k + 1] = 0
        positions[k + 2] = (j / (rows - 1) - 0.5) * 7
      }
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return g
  }, [cols, rows])

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
          uPointer: { value: new THREE.Vector2() },
          uPresence: { value: 0 },
          uPixelRatio: { value: 1 },
          uColor: { value: COLORS.white },
          uAccent: { value: COLORS.orange },
        },
      }),
    [],
  )
  useEffect(() => () => geometry.dispose(), [geometry])
  useEffect(() => () => material.dispose(), [material])

  useSceneFrame((state, delta, frame) => {
    const u = material.uniforms
    if (!frame.reduced) u.uTime.value += delta
    const l = lean.current
    const follow = !frame.reduced && frame.layout === 'desktop' && pointer.active
    l.x = damp(l.x, follow ? pointer.x : 0, 2, delta)
    l.y = damp(l.y, follow ? pointer.y : 0, 2, delta)
    u.uPointer.value.set(l.x * 8, -l.y * 3.5)
    u.uPresence.value = frame.presence
    u.uPixelRatio.value = dpr
  })

  return (
    <points
      ref={points}
      geometry={geometry}
      material={material}
      position={[0, -1.2, -1]}
      rotation-x={0.35}
      frustumCulled={false}
    />
  )
}

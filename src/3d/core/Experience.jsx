import { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { QUALITY } from '../../config/quality'
import { useAppStore, useTier } from '../../store/useAppStore'
import { MainEnvironment } from '../environments/MainEnvironment'
import { PostProcessing } from '../effects/PostProcessing'
import { ParticleField } from '../particles/ParticleField'
import { CameraController } from './CameraController'
import { FrameDriver } from './FrameDriver'
import { Lighting } from './Lighting'
import { PerformanceManager } from './PerformanceManager'
import { ReadySignal } from './ReadySignal'
import { SceneManager } from './SceneManager'
import styles from './Experience.module.css'

const CONTEXT_RESTORE_GRACE_MS = 3000

/**
 * The single persistent WebGL canvas, fixed behind the DOM. Decorative only:
 * every piece of content it illustrates also exists in the DOM.
 */
export default function Experience() {
  const tier = useTier()
  const quality = QUALITY[tier] ?? QUALITY.low
  const completeLoadStep = useAppStore((s) => s.completeLoadStep)

  useEffect(() => {
    completeLoadStep('experience')
  }, [completeLoadStep])

  const onCreated = ({ gl }) => {
    gl.toneMapping = THREE.NeutralToneMapping
    // A lost context that is not restored quickly switches the site to DOM visuals.
    let timer = 0
    const canvas = gl.domElement
    canvas.addEventListener('webglcontextlost', (e) => {
      e.preventDefault()
      timer = setTimeout(() => useAppStore.getState().setWebglFailed(), CONTEXT_RESTORE_GRACE_MS)
    })
    canvas.addEventListener('webglcontextrestored', () => clearTimeout(timer))
  }

  return (
    <div className={styles.canvas} aria-hidden="true">
      <Canvas
        frameloop="never"
        dpr={quality.dpr}
        gl={{
          antialias: !quality.postprocessing,
          powerPreference: 'high-performance',
          alpha: false,
          stencil: false,
        }}
        camera={{ fov: 35, near: 0.1, far: 60, position: [0, 0, 9] }}
        onCreated={onCreated}
      >
        <color attach="background" args={['#000000']} />
        <fog attach="fog" args={['#000000', 9, 30]} />
        <FrameDriver />
        <PerformanceManager />
        <Lighting />
        {quality.environment && <MainEnvironment />}
        <CameraController />
        <ParticleField count={quality.ambientParticles} />
        <SceneManager />
        {quality.postprocessing && <PostProcessing config={quality.postprocessing} highQuality={tier === 'high'} />}
        <ReadySignal />
      </Canvas>
    </div>
  )
}

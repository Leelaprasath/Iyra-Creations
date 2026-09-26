import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { QUALITY } from '../../config/quality'
import { useAppStore, useTier } from '../../store/useAppStore'
import { compileForPipeline } from '../utils/compile'

const FRAMES_BEFORE_READY = 3

/**
 * Reports the "firstFrame" loading milestone once shaders are compiled and a
 * few frames have actually rendered — the loader never shows 100% early.
 * compileAsync uses KHR_parallel_shader_compile where available, so the
 * loader keeps animating while programs compile off the main thread.
 */
export function ReadySignal() {
  const gl = useThree((s) => s.gl)
  const scene = useThree((s) => s.scene)
  const camera = useThree((s) => s.camera)
  const compiled = useRef(false)
  const frames = useRef(0)
  const done = useRef(false)
  const offscreen = Boolean(QUALITY[useTier()]?.postprocessing)

  useEffect(() => {
    let cancelled = false
    const finish = () => {
      if (!cancelled) compiled.current = true
    }
    compileForPipeline(gl, scene, camera, scene, offscreen).then(finish, finish)
    return () => {
      cancelled = true
    }
  }, [gl, scene, camera, offscreen])

  useFrame(() => {
    if (done.current || !compiled.current) return
    frames.current += 1
    if (frames.current >= FRAMES_BEFORE_READY) {
      done.current = true
      useAppStore.getState().completeLoadStep('firstFrame')
    }
  })
  return null
}

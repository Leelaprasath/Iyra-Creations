import { createContext, useContext } from 'react'
import { useFrame } from '@react-three/fiber'
import { getSection, tracker } from '../../runtime/tracker'
import { useAppStore } from '../../store/useAppStore'
import { clamp, quantize } from '../../utils/math'

export const SceneContext = createContext(null)

export const useSceneContext = () => useContext(SceneContext)

const frame = { progress: 0, presence: 0, view: 0, reduced: false, layout: 'desktop', tier: 'medium' }

/**
 * Per-frame callback for a scene, skipped while the scene is hidden.
 * Receives (state, delta, frame) where frame has:
 *   progress  0..1 pinned-scroll progress of the scene's section
 *             (stepped into `steps` discrete stages for reduced motion)
 *   presence  1 when the scene is focused, → 0 as the camera leaves it
 *   view      0..1 viewport progress of the section
 * The `frame` object is reused — do not keep references to it.
 */
export function useSceneFrame(callback, { steps = 5 } = {}) {
  const ctx = useContext(SceneContext)
  useFrame((state, delta) => {
    if (!ctx.group.current?.visible) return
    const section = getSection(ctx.id)
    const { reducedMotion, layout, tier } = useAppStore.getState()
    frame.reduced = reducedMotion
    frame.layout = layout
    frame.tier = tier
    frame.view = section.view
    frame.progress = reducedMotion ? quantize(section.pin, steps) : section.pin
    frame.presence = clamp(1 - Math.abs(tracker.journey - ctx.index))
    callback(state, Math.min(delta, 0.1), frame)
  })
}

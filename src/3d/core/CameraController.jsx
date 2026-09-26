import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { DAMP, PARALLAX } from '../../config/motion'
import { SCENES, sceneY } from '../../config/scenes'
import { intro } from '../../runtime/intro'
import { pointer } from '../../runtime/pointer'
import { tracker } from '../../runtime/tracker'
import { useAppStore } from '../../store/useAppStore'
import { clamp, lerp, smoothstep } from '../../utils/math'

const { damp } = THREE.MathUtils
const LAST = SCENES.length - 1
/** How much closer the camera starts during the intro (world units). */
const INTRO_PUSH_IN = 4.2

/**
 * Film-camera rig. Interpolates between per-scene keyframes from the scroll
 * journey, then damps toward the result — it never teleports. Adds a small
 * pointer parallax (desktop only, off for reduced motion), the intro pull-back
 * and a lens shift that frames the object beside or above the DOM copy.
 */
export function CameraController() {
  const desiredPos = useRef(new THREE.Vector3())
  const desiredTarget = useRef(new THREE.Vector3())
  const target = useRef(new THREE.Vector3())
  const look = useRef({ px: 0, py: 0, sx: 0, sy: 0 })
  const initialised = useRef(false)

  useFrame((state, delta) => {
    const { camera, size } = state
    const { reducedMotion, layout } = useAppStore.getState()
    const dt = Math.min(delta, 0.1)

    const j = clamp(tracker.journey, 0, LAST)
    const i = Math.floor(j)
    const a = SCENES[i]
    const b = SCENES[Math.min(i + 1, LAST)]
    const f = smoothstep(j - i)
    const ya = sceneY(i)
    const yb = sceneY(Math.min(i + 1, LAST))

    desiredPos.current.set(
      lerp(a.camera[0], b.camera[0], f),
      lerp(ya + a.camera[1], yb + b.camera[1], f),
      lerp(a.camera[2], b.camera[2], f) - (1 - intro.reveal) * INTRO_PUSH_IN,
    )
    desiredTarget.current.set(
      lerp(a.target[0], b.target[0], f),
      lerp(ya + a.target[1], yb + b.target[1], f),
      lerp(a.target[2], b.target[2], f),
    )

    const l = look.current
    const parallax = !reducedMotion && layout === 'desktop' && pointer.active
    l.px = damp(l.px, parallax ? pointer.x : 0, DAMP.pointer, dt)
    l.py = damp(l.py, parallax ? pointer.y : 0, DAMP.pointer, dt)
    desiredPos.current.x += l.px * PARALLAX.cameraShift
    desiredPos.current.y += l.py * PARALLAX.cameraShift * 0.6

    const frameA = a.frame[layout]
    const frameB = b.frame[layout]
    const lambda = reducedMotion ? DAMP.cameraReduced : DAMP.camera

    if (!initialised.current) {
      camera.position.copy(desiredPos.current)
      target.current.copy(desiredTarget.current)
      l.sx = frameA[0] * intro.reveal
      l.sy = frameA[1] * intro.reveal
      initialised.current = true
    } else {
      camera.position.x = damp(camera.position.x, desiredPos.current.x, lambda, dt)
      camera.position.y = damp(camera.position.y, desiredPos.current.y, lambda, dt)
      camera.position.z = damp(camera.position.z, desiredPos.current.z, lambda, dt)
      target.current.x = damp(target.current.x, desiredTarget.current.x, lambda, dt)
      target.current.y = damp(target.current.y, desiredTarget.current.y, lambda, dt)
      target.current.z = damp(target.current.z, desiredTarget.current.z, lambda, dt)
      // The intro is framed dead-centre; the layout shift eases in as it resolves.
      l.sx = damp(l.sx, lerp(frameA[0], frameB[0], f) * intro.reveal, lambda, dt)
      l.sy = damp(l.sy, lerp(frameA[1], frameB[1], f) * intro.reveal, lambda, dt)
    }
    camera.lookAt(target.current)

    // Lens shift: move the view window so the focus point lands at (sx, sy).
    const w = size.width
    const h = size.height
    camera.setViewOffset(w, h, -l.sx * w, l.sy * h, w, h)
  })

  return null
}

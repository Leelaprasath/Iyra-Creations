import { lazy, Suspense, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { SCENES, sceneY } from '../../config/scenes'
import { tracker } from '../../runtime/tracker'
import { ErrorBoundary } from '../../components/common/ErrorBoundary'
import HeroScene from '../scenes/HeroScene'
import { SceneContext } from './SceneContext'

/**
 * Scene registry. The hero is bundled with the canvas (above the fold); every
 * later scene is its own chunk, fetched when the journey comes within
 * MOUNT_DISTANCE scenes of it (i.e. one to two sections early).
 */
const REGISTRY = {
  hero: HeroScene,
  services: lazy(() => import('../scenes/ServicesScene')),
  web: lazy(() => import('../scenes/WebsiteScene')),
  saas: lazy(() => import('../scenes/SaaSScene')),
  logo: lazy(() => import('../scenes/LogoScene')),
  branding: lazy(() => import('../scenes/BrandingScene')),
  capabilities: lazy(() => import('../scenes/CapabilitiesScene')),
  work: lazy(() => import('../scenes/WorkScene')),
  process: lazy(() => import('../scenes/ProcessScene')),
  about: lazy(() => import('../scenes/AboutScene')),
  philosophy: lazy(() => import('../scenes/PhilosophyScene')),
  namereveal: lazy(() => import('../scenes/NameRevealScene')),
  cta: lazy(() => import('../scenes/ContactScene')),
  contact: lazy(() => import('../scenes/ContactScene')),
}

const MOUNT_DISTANCE = 2
/** Beyond this journey distance a scene is hidden (not rendered, frame work skipped). */
const VISIBLE_DISTANCE = 1.25

function SceneSlot({ index, id, Component }) {
  const group = useRef(null)
  const [mounted, setMounted] = useState(() => index === 0)
  const ctx = useMemo(() => ({ index, id, group }), [index, id])

  useFrame(() => {
    const g = group.current
    if (!g) return
    const distance = Math.abs(tracker.journey - index)
    // One-time state change (mount), never a per-frame render.
    if (!mounted && distance <= MOUNT_DISTANCE) setMounted(true)
    g.visible = distance < VISIBLE_DISTANCE
  })

  return (
    <group ref={group} position={[0, sceneY(index), 0]} visible={index === 0}>
      {mounted && (
        <SceneContext.Provider value={ctx}>
          <ErrorBoundary>
            <Suspense fallback={null}>
              <Component />
            </Suspense>
          </ErrorBoundary>
        </SceneContext.Provider>
      )}
    </group>
  )
}

export function SceneManager() {
  return SCENES.map((scene, index) => (
    <SceneSlot key={scene.id} index={index} id={scene.id} Component={REGISTRY[scene.id]} />
  ))
}

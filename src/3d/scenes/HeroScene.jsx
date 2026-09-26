import { useRef } from 'react'
import { useThree } from '@react-three/fiber'
import { QUALITY } from '../../config/quality'
import { intro } from '../../runtime/intro'
import { useAppStore, useTier } from '../../store/useAppStore'
import { smoothstep } from '../../utils/math'
import { CreationCore } from '../objects/CreationCore'
import { LOGO_PARTS, LOGO_TAGLINE, LOGO_VIEWBOX } from '../../brand/logo'
import { ParticleText } from '../particles/ParticleText'
import { sampleLogo } from '../particles/sampleText'

/** Forms the real IYRA logo: I → Y → R → A → frame → CREATIONS. */
const sampleIntroLogo = (opts) => sampleLogo({ ...opts, parts: LOGO_PARTS, tagline: LOGO_TAGLINE, viewBox: LOGO_VIEWBOX })
/** Camera distance during the intro (see CameraController INTRO_PUSH_IN). */
const INTRO_DISTANCE = 4.8
const FOV_TAN = Math.tan((35 / 2) * (Math.PI / 180))

/** Particles gather from the dark into the IYRA logo, part by part, then release as the core appears. */
function IntroWordmark({ quality }) {
  const points = useRef(null)
  const aspect = useThree((s) => s.size.width / s.size.height)
  const visibleWidth = 2 * FOV_TAN * INTRO_DISTANCE * aspect
  // Round so small resizes don't resample the text.
  const width = Math.round(Math.min(4.2, visibleWidth * 0.74) * 10) / 10

  return (
    <group ref={points}>
      <ParticleText
        sampler={sampleIntroLogo}
        width={width}
        step={quality.textParticleStep}
        maxPoints={quality.maxTextParticles}
        scatter={7}
        size={1.1}
        drive={(u, _state, _delta, sample) => {
          // Each logo part forms on its own beat as the intro progresses.
          u.uForm.value = 1
          u.uReveal.value = intro.form * ((sample?.letterCount ?? 6) + 0.5)
          u.uDisperse.value = smoothstep(intro.reveal)
          u.uDust.value = 1 - intro.form
          u.uMotion.value = useAppStore.getState().reducedMotion ? 0 : 1
          if (points.current) points.current.visible = intro.reveal < 1
        }}
      />
    </group>
  )
}

export default function HeroScene() {
  const tier = useTier()
  const quality = QUALITY[tier] ?? QUALITY.low
  const introPhase = useAppStore((s) => s.introPhase)

  return (
    <>
      <CreationCore quality={quality} />
      {introPhase !== 'done' && <IntroWordmark quality={quality} />}
    </>
  )
}

import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { QUALITY } from '../../config/quality'
import { useAppStore, useTier } from '../../store/useAppStore'
import { easeOutCubic, range } from '../../utils/math'
import { COLORS } from '../materials/palette'
import { ParticleText } from '../particles/ParticleText'
import { Glow } from './Glow'

const FOV_TAN = Math.tan((35 / 2) * (Math.PI / 180))

/** Default beat timeline (fractions of `getProgress()`); see data/nameReveal.js. */
const DEFAULT_TIMELINE = { dust: [0.02, 0.14], letters: [0.14, 0.66], subtitle: [0.68, 0.76], outro: [0.8, 0.9] }

/**
 * "particles" style: darkness → drifting dust → each letter gathers from the
 * dust on its own beat under a warm light → the name holds, light streak
 * beneath it for the subtitle.
 */
function ParticleReveal({ name, accentColor, getProgress, timeline, distance }) {
  const tier = useTier()
  const quality = QUALITY[tier] ?? QUALITY.low
  const aspect = useThree((s) => s.size.width / s.size.height)
  const glow = useRef(null)
  const streak = useRef(null)
  const accent = useMemo(() => new THREE.Color(accentColor), [accentColor])

  const visibleW = 2 * FOV_TAN * distance * aspect
  const width = Math.round(Math.min(5.2, visibleW * 0.78) * 10) / 10

  useFrame(() => {
    const p = getProgress()
    const lit = easeOutCubic(range(p, timeline.letters[0], timeline.letters[1]))
    glow.current.material.uniforms.uIntensity.value = 0.15 + lit * 0.55
    const sub = easeOutCubic(range(p, ...timeline.subtitle))
    streak.current.material.uniforms.uIntensity.value = sub * 0.9
    streak.current.scale.x = 0.2 + sub * 0.8
  })

  return (
    <>
      <Glow ref={glow} size={width * 1.6} color={accent} position={[0, 0, -0.6]} />
      <Glow ref={streak} size={width * 1.3} stretch={14} color={accent} position={[0, -width * 0.16, 0.05]} />
      <ParticleText
        lines={[{ text: name, size: 1, tracking: 0.1 }]}
        width={width}
        step={Math.max(2, quality.textParticleStep - 1)}
        maxPoints={Math.round(quality.maxTextParticles * 1.4)}
        scatter={5}
        size={1.5}
        accent={accent}
        color={COLORS.white}
        seed={9}
        drive={(u, _s, _d, sample) => {
          const p = getProgress()
          const letters = sample?.letterCount ?? name.length
          u.uForm.value = 1
          u.uDust.value = range(p, ...timeline.dust)
          u.uReveal.value = range(p, ...timeline.letters) * (letters + 0.6)
          u.uMotion.value = useAppStore.getState().reducedMotion ? 0 : 1
        }}
      />
    </>
  )
}

/** Reveal styles. Add new looks here (light, elegant, cinematic, gold, floral…). */
const STYLES = {
  particles: ParticleReveal,
}

/**
 * Reusable cinematic name reveal engine.
 *
 *   <NameRevealExperience name="ANAYA" subtitle="A new chapter" accentColor="#DB622B"
 *     style="particles" getProgress={() => pinProgress} />
 *
 * `getProgress` returns 0..1 and is read every frame (scroll, a GSAP timeline
 * or a video-export clock can all drive it). The subtitle is rendered by the
 * DOM layer so it stays accessible and crisp.
 */
export function NameRevealExperience({
  name,
  accentColor = '#DB622B',
  style = 'particles',
  getProgress,
  timeline = DEFAULT_TIMELINE,
  distance = 8,
}) {
  const Style = STYLES[style] ?? STYLES.particles
  return (
    <Style name={name} accentColor={accentColor} getProgress={getProgress} timeline={timeline} distance={distance} />
  )
}

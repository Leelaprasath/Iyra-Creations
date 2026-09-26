import { useCallback } from 'react'
import { nameRevealDemo } from '../../data/nameReveal'
import { getSection } from '../../runtime/tracker'
import { useAppStore } from '../../store/useAppStore'
import { quantize } from '../../utils/math'
import { NameRevealExperience } from '../objects/NameRevealExperience'

/** The demonstration reveal (ANAYA), driven by the pinned scroll of its section. */
export default function NameRevealScene() {
  const getProgress = useCallback(() => {
    const p = getSection('namereveal').pin
    // Reduced motion: letters arrive in discrete beats instead of scrubbing.
    return useAppStore.getState().reducedMotion ? quantize(p, nameRevealDemo.name.length * 2) : p
  }, [])

  return (
    <NameRevealExperience
      name={nameRevealDemo.name}
      subtitle={nameRevealDemo.subtitle}
      accentColor={nameRevealDemo.accentColor}
      style={nameRevealDemo.style}
      timeline={nameRevealDemo.timeline}
      getProgress={getProgress}
    />
  )
}

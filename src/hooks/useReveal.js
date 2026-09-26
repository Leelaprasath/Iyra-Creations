import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { DURATION, EASE, STAGGER } from '../config/motion'
import { useReducedMotion } from '../store/useAppStore'

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText)

const START = 'top 88%'

/**
 * Scroll-entrance reveals for everything inside `scopeRef` marked with:
 *   data-reveal="lines"  masked line-by-line rise (editorial headings)
 *   data-reveal="fade"   soft rise + fade (copy, buttons, lists)
 * Reduced motion: a short opacity fade only.
 * All tweens, SplitText instances and ScrollTriggers are reverted on unmount.
 */
export function useReveal(scopeRef) {
  const reduced = useReducedMotion()

  useGSAP(
    () => {
      const scope = scopeRef.current
      if (!scope) return
      const trigger = (el) => ({ trigger: el, start: START, toggleActions: 'play none none none' })

      scope.querySelectorAll('[data-reveal="lines"]').forEach((el) => {
        if (reduced) {
          gsap.from(el, { autoAlpha: 0, duration: DURATION.fast, scrollTrigger: trigger(el) })
          return
        }
        SplitText.create(el, {
          type: 'lines',
          mask: 'lines',
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 110,
              duration: DURATION.slow,
              ease: EASE.out,
              stagger: STAGGER.lines,
              scrollTrigger: trigger(el),
            }),
        })
      })

      scope.querySelectorAll('[data-reveal="fade"]').forEach((el) => {
        gsap.from(el, {
          autoAlpha: 0,
          y: reduced ? 0 : 28,
          duration: reduced ? DURATION.fast : DURATION.base,
          ease: EASE.soft,
          scrollTrigger: trigger(el),
        })
      })
    },
    { scope: scopeRef, dependencies: [reduced], revertOnUpdate: true },
  )
}

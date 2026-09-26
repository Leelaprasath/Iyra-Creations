# IYRA — Animation Rules

- Constants (durations, easings, stagger, camera damping) live in `src/config/motion.js`. No unexplained magic numbers in components.
- Easing language: `expo.out` / `power3.out` for entrances, `power2.inOut` for transitions. No elastic/bounce.
- GSAP in React: `useGSAP()` from `@gsap/react` with a scope ref; it reverts timelines and ScrollTriggers on unmount.
- ScrollTrigger is used for DOM reveals. 3D scroll state comes from the tracker, not per-object ScrollTriggers.
- Lenis: `autoRaf: false`, `lenis.on('scroll', ScrollTrigger.update)`, `gsap.ticker.add(t => lenis.raf(t * 1000))`, `gsap.ticker.lagSmoothing(0)`. Never a second scroll loop.
- Sticky chapters use CSS `position: sticky` (no ScrollTrigger pin spacers) so measurements stay predictable.
- Frame animation: damp toward targets (`THREE.MathUtils.damp`) instead of setting positions directly — the camera never teleports.
- When motion looks wrong: fix timing, easing, spacing, composition — do not add more motion.
- Reduced motion: scroll scenes step between discrete stages with a short damp, no idle rotation, no parallax, intro skipped.

import { create } from 'zustand'
import { getLayout } from '../config/breakpoints'
import { detectFeatures, resolveTier } from '../utils/deviceCapability'

const isBrowser = typeof window !== 'undefined'
const initialLayout = isBrowser ? getLayout(window.innerWidth) : 'desktop'
const initialReduced = isBrowser && window.matchMedia('(prefers-reduced-motion: reduce)').matches
// Decided synchronously so the WebGL chunk is never requested for a fallback device.
const initialTier = isBrowser ? resolveTier(detectFeatures(initialLayout)) : 'medium'

/**
 * Shared application state that more than one tree (DOM + WebGL) reacts to.
 * High-frequency values (scroll, pointer, intro tween) live in src/runtime
 * instead, so they never trigger React renders.
 */
export const useAppStore = create((set) => ({
  /** 'high' | 'medium' | 'low' | 'fallback' */
  tier: initialTier,
  setTier: (tier) => set({ tier }),

  /** 'mobile' | 'tablet' | 'desktop' */
  layout: initialLayout,
  setLayout: (layout) => set({ layout }),

  reducedMotion: initialReduced,
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),

  /** 'loading' | 'forming' | 'revealing' | 'done' */
  introPhase: 'loading',
  setIntroPhase: (introPhase) => set({ introPhase }),

  /** Real loading milestones; displayed progress is derived from them. */
  loadSteps: { fonts: false, experience: false, firstFrame: false },
  completeLoadStep: (step) =>
    set((s) => {
      if (s.loadSteps[step]) return s
      // Visible in DevTools > Performance, for loading diagnostics.
      performance.mark?.(`iyra:load:${step}`)
      return { loadSteps: { ...s.loadSteps, [step]: true } }
    }),

  /** Set when the WebGL experience throws — the site switches to DOM visuals. */
  webglFailed: false,
  setWebglFailed: () => set({ webglFailed: true, tier: 'fallback' }),

  menuOpen: false,
  setMenuOpen: (menuOpen) => set({ menuOpen }),

  /** Active capability index (driven by the Capabilities section scroll). */
  activeCapability: 0,
  setActiveCapability: (activeCapability) => set({ activeCapability }),
}))

export const useTier = () => useAppStore((s) => s.tier)
export const useLayout = () => useAppStore((s) => s.layout)
export const useReducedMotion = () => useAppStore((s) => s.reducedMotion)

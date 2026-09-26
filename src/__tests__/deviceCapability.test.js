import { describe, expect, it } from 'vitest'
import { resolveTier } from '../utils/deviceCapability'

const gpu = { webgl2: true, renderer: 'ANGLE (NVIDIA GeForce RTX)' }

describe('resolveTier', () => {
  it('falls back without WebGL', () => {
    expect(resolveTier({ webgl: null, layout: 'desktop' })).toBe('fallback')
  })
  it('uses low for software renderers', () => {
    expect(resolveTier({ webgl: { renderer: 'Google SwiftShader' }, layout: 'desktop', cores: 16, memory: 16 })).toBe(
      'low',
    )
  })
  it('gives capable desktops high', () => {
    expect(resolveTier({ webgl: gpu, layout: 'desktop', cores: 12, memory: 16 })).toBe('high')
  })
  it('keeps phones conservative', () => {
    expect(resolveTier({ webgl: gpu, layout: 'mobile', cores: 4, memory: 4 })).toBe('low')
    expect(resolveTier({ webgl: gpu, layout: 'mobile', cores: 8, memory: 8 })).toBe('medium')
  })
  it('respects save-data', () => {
    expect(resolveTier({ webgl: gpu, layout: 'desktop', cores: 12, memory: 16, saveData: true })).toBe('low')
  })
  it('honours a valid ?quality override only', () => {
    expect(resolveTier({ webgl: gpu, layout: 'desktop', override: 'fallback' })).toBe('fallback')
    expect(resolveTier({ webgl: gpu, layout: 'desktop', cores: 12, memory: 16, override: 'ultra' })).toBe('high')
  })
})

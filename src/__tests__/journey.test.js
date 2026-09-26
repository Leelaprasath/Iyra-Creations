import { describe, expect, it } from 'vitest'
import { computeJourney, pinProgress, plateau, viewProgress } from '../runtime/journey'

const VH = 800
const section = (top, height) => {
  const [start, end] = plateau(top, height, VH)
  return { top, height, start, end }
}

describe('plateau', () => {
  it('holds a tall sticky section for its pinned duration', () => {
    expect(plateau(1000, 3 * VH, VH)).toEqual([1000, 1000 + 2 * VH])
  })
  it('centres a short section at a single point', () => {
    expect(plateau(1000, 400, VH)).toEqual([800, 800])
  })
})

describe('computeJourney', () => {
  const metrics = [section(0, VH), section(VH, 3 * VH), section(4 * VH, VH)]

  it('starts at the first scene', () => {
    expect(computeJourney(metrics, 0)).toBe(0)
  })
  it('transitions linearly between plateaus', () => {
    expect(computeJourney(metrics, VH / 2)).toBeCloseTo(0.5)
  })
  it('plateaus while a chapter is pinned', () => {
    expect(computeJourney(metrics, VH * 1.5)).toBe(1)
    expect(computeJourney(metrics, VH * 3)).toBe(1)
  })
  it('clamps after the last scene', () => {
    expect(computeJourney(metrics, 99999)).toBe(2)
  })
  it('handles no sections', () => {
    expect(computeJourney([], 100)).toBe(0)
  })
})

describe('progress helpers', () => {
  it('pin progress spans the sticky range', () => {
    expect(pinProgress(1000, 3 * VH, VH, 1000)).toBe(0)
    expect(pinProgress(1000, 3 * VH, VH, 1000 + VH)).toBeCloseTo(0.5)
    expect(pinProgress(1000, 3 * VH, VH, 1000 + 2 * VH)).toBe(1)
  })
  it('view progress is 0.5 when a viewport-high section fills the screen', () => {
    expect(viewProgress(0, VH, VH, 0)).toBeCloseTo(0.5)
  })
})

import { describe, it, expect } from 'vitest'
import { computeResult, buildDefaultConfig, randomShape } from './TestEngine'
import { getTestById } from '../../data/testCatalogue'
import type { TestEvent } from '../../types/session'

describe('buildDefaultConfig', () => {
  it('produces a config with all schema keys for vlta', () => {
    const vlta = getTestById('vlta')!
    const config = buildDefaultConfig(vlta)
    for (const field of vlta.configSchema) {
      expect(config[field.key]).toBeDefined()
    }
  })

  it('uses the defaultValue from each field', () => {
    const vlta = getTestById('vlta')!
    const config = buildDefaultConfig(vlta)
    for (const field of vlta.configSchema) {
      expect(config[field.key]).toBe(field.defaultValue)
    }
  })
})

describe('randomShape', () => {
  it('returns one of the three valid shapes', () => {
    const valid = new Set(['circle', 'square', 'triangle'])
    for (let i = 0; i < 30; i++) {
      expect(valid.has(randomShape())).toBe(true)
    }
  })

  it('returns all three shapes over many calls', () => {
    const seen = new Set<string>()
    for (let i = 0; i < 200; i++) seen.add(randomShape())
    expect(seen.size).toBe(3)
  })
})

describe('computeResult', () => {
  const config = { maxDurationMin: 5, shapeIntervalSec: 1.5, shapeDurationMs: 500, maxFailureCount: 5 }

  it('returns a TestResult with the correct testId', () => {
    const result = computeResult([], config, 'vlta')
    expect(result.testId).toBe('vlta')
  })

  it('returns a TestResult with the passed config', () => {
    const result = computeResult([], config, 'vlta')
    expect(result.config).toBe(config)
  })

  it('returns numeric score, accuracy, and reactionTimeMs', () => {
    const events: TestEvent[] = [
      { type: 'shape_shown', timestampMs: 1000, shape: 'circle', isTarget: true },
      { type: 'response_correct', timestampMs: 1320, reactionMs: 320 },
    ]
    const result = computeResult(events, config, 'vlta')
    expect(typeof result.score).toBe('number')
    expect(typeof result.accuracy).toBe('number')
    expect(typeof result.reactionTimeMs).toBe('number')
  })

  it('accuracy is between 0 and 1', () => {
    const result = computeResult([], config, 'vlta')
    expect(result.accuracy).toBeGreaterThanOrEqual(0)
    expect(result.accuracy).toBeLessThanOrEqual(1)
  })

  it('preserves rawEvents', () => {
    const events: TestEvent[] = [
      { type: 'shape_shown', timestampMs: 500, shape: 'square', isTarget: false },
    ]
    const result = computeResult(events, config, 'vlta')
    expect(result.rawEvents).toBe(events)
  })

  it('accuracy is hits / targets', () => {
    const events: TestEvent[] = [
      { type: 'shape_shown', timestampMs: 0, shape: 'circle', isTarget: false },
      { type: 'shape_shown', timestampMs: 1500, shape: 'circle', isTarget: true },
      { type: 'response_correct', timestampMs: 1600, reactionMs: 100 },
      { type: 'shape_shown', timestampMs: 3000, shape: 'circle', isTarget: true },
      { type: 'miss', timestampMs: 3500 },
    ]
    const result = computeResult(events, config, 'vlta')
    expect(result.hits).toBe(1)
    expect(result.misses).toBe(1)
    expect(result.commissions).toBe(0)
    expect(result.accuracy).toBeCloseTo(0.5)
  })

  it('counts commission errors', () => {
    const events: TestEvent[] = [
      { type: 'shape_shown', timestampMs: 0, shape: 'circle', isTarget: false },
      { type: 'response_incorrect', timestampMs: 100 },
      { type: 'response_incorrect', timestampMs: 200 },
    ]
    const result = computeResult(events, config, 'vlta')
    expect(result.commissions).toBe(2)
    expect(result.hits).toBe(0)
  })

  it('averages reaction times across correct responses', () => {
    const events: TestEvent[] = [
      { type: 'response_correct', timestampMs: 100, reactionMs: 200 },
      { type: 'response_correct', timestampMs: 200, reactionMs: 400 },
    ]
    const result = computeResult(events, config, 'vlta')
    expect(result.reactionTimeMs).toBe(300)
  })
})

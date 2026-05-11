import type { TestDefinition, TestConfig, TestEvent, TestResult, ShapeType } from '../../types/session'

const SHAPES: ReadonlyArray<ShapeType> = ['circle', 'square', 'triangle']

/**
 * Return a random shape type.
 */
export function randomShape(): ShapeType {
  return SHAPES[Math.floor(Math.random() * SHAPES.length)]
}

/**
 * Build a config object from a test definition's schema defaults.
 */
export function buildDefaultConfig(test: TestDefinition): TestConfig {
  return Object.fromEntries(test.configSchema.map((f) => [f.key, f.defaultValue]))
}

/**
 * Compute a TestResult from a completed sequence of events.
 * Accuracy = hits / targets (shape_shown events where isTarget is true).
 */
export function computeResult(
  events: ReadonlyArray<TestEvent>,
  config: TestConfig,
  testId: string,
): TestResult {
  const targets = events.filter((e) => e.type === 'shape_shown' && e.isTarget).length
  const hits = events.filter((e) => e.type === 'response_correct').length
  const misses = events.filter((e) => e.type === 'miss').length
  const commissions = events.filter((e) => e.type === 'response_incorrect').length

  const accuracy = targets > 0 ? hits / targets : 0

  const reactionTimes = events
    .filter((e) => e.type === 'response_correct')
    .map((e) => e.reactionMs)
    .filter((ms): ms is number => ms !== undefined)

  const reactionTimeMs =
    reactionTimes.length > 0
      ? reactionTimes.reduce((sum, ms) => sum + ms, 0) / reactionTimes.length
      : 0

  const score = Math.round(accuracy * 100)

  return {
    testId,
    config,
    score,
    accuracy,
    reactionTimeMs,
    hits,
    misses,
    commissions,
    completedAt: Date.now(),
    rawEvents: events,
  }
}

import type { TestDefinition } from '../types/session'

const vltaTest: TestDefinition = {
  id: 'vlta',
  name: 'Visual 1-Back',
  description:
    'Shapes appear one at a time. Press Space, click, or tap whenever the current shape matches the previous one. The test ends when the time limit is reached or you miss too many targets.',
  configSchema: [
    {
      key: 'maxDurationMin',
      label: 'Max Duration',
      type: 'number',
      defaultValue: 5,
      min: 1,
      max: 60,
      step: 1,
      unit: 'minutes',
    },
    {
      key: 'shapeIntervalSec',
      label: 'Shape Interval',
      type: 'number',
      defaultValue: 1.5,
      min: 0.5,
      max: 5,
      step: 0.1,
      unit: 'seconds',
    },
    {
      key: 'shapeDurationMs',
      label: 'Shape Display Duration',
      type: 'number',
      defaultValue: 500,
      min: 100,
      max: 2000,
      step: 50,
      unit: 'ms',
    },
    {
      key: 'enableMaxMisses',
      label: 'Limit misses',
      type: 'toggle',
      defaultValue: true,
    },
    {
      key: 'maxFailureCount',
      label: 'Max Misses',
      type: 'number',
      defaultValue: 5,
      min: 1,
      max: 20,
      step: 1,
      dependsOn: 'enableMaxMisses',
    },
  ],
}

export const testCatalogue: ReadonlyArray<TestDefinition> = [vltaTest]

export function getTestById(id: string): TestDefinition | undefined {
  return testCatalogue.find((t) => t.id === id)
}

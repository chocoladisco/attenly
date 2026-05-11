export type ConfigFieldType = 'number' | 'select' | 'toggle'

export interface ConfigFieldSchema {
  readonly key: string
  readonly label: string
  readonly type: ConfigFieldType
  readonly defaultValue: number | string | boolean
  readonly options?: ReadonlyArray<{ label: string; value: string }>
  readonly min?: number
  readonly max?: number
  readonly step?: number
  readonly unit?: string
  readonly dependsOn?: string
}

export interface TestDefinition {
  readonly id: string
  readonly name: string
  readonly description: string
  readonly configSchema: ReadonlyArray<ConfigFieldSchema>
}

export type TestConfig = Readonly<Record<string, number | string | boolean>>

export type ShapeType = 'circle' | 'square' | 'triangle'

export type TestEventType =
  | 'shape_shown'
  | 'response_correct'
  | 'response_incorrect'
  | 'miss'

export interface TestEvent {
  readonly type: TestEventType
  readonly timestampMs: number
  readonly shape?: ShapeType
  readonly isTarget?: boolean
  readonly reactionMs?: number
}

export interface TestResult {
  readonly testId: string
  readonly config: TestConfig
  readonly score: number
  readonly accuracy: number
  readonly reactionTimeMs: number
  readonly hits: number
  readonly misses: number
  readonly commissions: number
  readonly completedAt: number
  readonly rawEvents: ReadonlyArray<TestEvent>
}

export interface SessionState {
  readonly selectedTestId: string | null
  readonly config: TestConfig | null
  readonly result: TestResult | null
}

export type SessionAction =
  | { type: 'SELECT_TEST'; testId: string }
  | { type: 'SET_CONFIG'; config: TestConfig }
  | { type: 'RECORD_RESULT'; result: TestResult }
  | { type: 'RESET' }

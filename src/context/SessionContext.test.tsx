import { describe, it, expect } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { sessionReducer } from './SessionContext'
import { SessionProvider, useSession } from './SessionContext'
import type { SessionState, TestResult } from '../types/session'

const initialState: SessionState = {
  selectedTestId: null,
  config: null,
  result: null,
}

describe('sessionReducer', () => {
  it('SELECT_TEST sets selectedTestId and clears config/result', () => {
    const state = sessionReducer(
      { selectedTestId: null, config: { maxDurationMin: 5 }, result: null },
      { type: 'SELECT_TEST', testId: 'vlta' },
    )
    expect(state.selectedTestId).toBe('vlta')
    expect(state.config).toBeNull()
    expect(state.result).toBeNull()
  })

  it('SET_CONFIG updates config without touching other fields', () => {
    const state = sessionReducer(
      { ...initialState, selectedTestId: 'vlta' },
      { type: 'SET_CONFIG', config: { maxDurationMin: 10, meanIntervalSec: 1, maxFailureCount: 3 } },
    )
    expect(state.config).toEqual({ maxDurationMin: 10, meanIntervalSec: 1, maxFailureCount: 3 })
    expect(state.selectedTestId).toBe('vlta')
  })

  it('RECORD_RESULT stores the result', () => {
    const result: TestResult = {
      testId: 'vlta',
      config: { maxDurationMin: 10 },
      score: 85,
      accuracy: 0.9,
      reactionTimeMs: 320,
      hits: 17,
      misses: 2,
      commissions: 1,
      completedAt: Date.now(),
      rawEvents: [],
    }
    const state = sessionReducer(
      { ...initialState, selectedTestId: 'vlta' },
      { type: 'RECORD_RESULT', result },
    )
    expect(state.result).toBe(result)
  })

  it('RESET returns to initial state', () => {
    const state = sessionReducer(
      { selectedTestId: 'vlta', config: { maxDurationMin: 5 }, result: null },
      { type: 'RESET' },
    )
    expect(state).toEqual(initialState)
  })

  it('does not mutate the previous state object', () => {
    const prev: SessionState = { selectedTestId: null, config: null, result: null }
    const next = sessionReducer(prev, { type: 'SELECT_TEST', testId: 'vlta' })
    expect(next).not.toBe(prev)
    expect(prev.selectedTestId).toBeNull()
  })
})

describe('SessionProvider / useSession', () => {
  function TestConsumer() {
    const { state, dispatch } = useSession()
    return (
      <div>
        <span data-testid="testId">{state.selectedTestId ?? 'none'}</span>
        <button onClick={() => dispatch({ type: 'SELECT_TEST', testId: 'vlta' })}>
          Select
        </button>
      </div>
    )
  }

  it('provides initial state', () => {
    render(
      <SessionProvider>
        <TestConsumer />
      </SessionProvider>,
    )
    expect(screen.getByTestId('testId').textContent).toBe('none')
  })

  it('dispatches actions and updates state', () => {
    render(
      <SessionProvider>
        <TestConsumer />
      </SessionProvider>,
    )
    act(() => {
      screen.getByRole('button', { name: 'Select' }).click()
    })
    expect(screen.getByTestId('testId').textContent).toBe('vlta')
  })

  it('throws when useSession is used outside SessionProvider', () => {
    const original = console.error
    console.error = () => {}
    expect(() => render(<TestConsumer />)).toThrow()
    console.error = original
  })
})

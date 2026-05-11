import { renderHook, act } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import { useVltaEngine } from './useVltaEngine'
import * as TestEngine from './TestEngine'
import type { TestConfig } from '../../types/session'

const config: TestConfig = {
  maxDurationMin: 1,
  shapeIntervalSec: 1,   // 1000ms per cycle
  shapeDurationMs: 300,  // visible 300ms, blank 700ms
  maxFailureCount: 3,
}

// Make randomShape always return 'circle' so every 2nd+ shape is a target.
function mockCircle() {
  vi.spyOn(TestEngine, 'randomShape').mockReturnValue('circle')
}

// Make randomShape alternate: circle, square, circle, square... (no consecutive matches)
function mockAlternating() {
  let n = 0
  vi.spyOn(TestEngine, 'randomShape').mockImplementation(() => (n++ % 2 === 0 ? 'circle' : 'square'))
}

describe('useVltaEngine', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('shows first shape immediately on mount', () => {
    mockCircle()
    const { result } = renderHook(() => useVltaEngine(config, vi.fn()))
    expect(result.current.currentShape).toBe('circle')
  })

  it('first shape is never a target', () => {
    mockCircle()
    const { result } = renderHook(() => useVltaEngine(config, vi.fn()))
    expect(result.current.isTarget).toBe(false)
  })

  it('hides the shape after shapeDurationMs', () => {
    mockCircle()
    const { result } = renderHook(() => useVltaEngine(config, vi.fn()))
    act(() => vi.advanceTimersByTime(300))
    expect(result.current.currentShape).toBeNull()
  })

  it('shows next shape after the full interval', () => {
    mockCircle()
    const { result } = renderHook(() => useVltaEngine(config, vi.fn()))
    act(() => vi.advanceTimersByTime(1000))
    expect(result.current.currentShape).toBe('circle')
  })

  it('second consecutive same shape is a target', () => {
    mockCircle()
    const { result } = renderHook(() => useVltaEngine(config, vi.fn()))
    act(() => vi.advanceTimersByTime(1000))
    expect(result.current.isTarget).toBe(true)
  })

  it('different consecutive shapes are not targets', () => {
    mockAlternating()
    const { result } = renderHook(() => useVltaEngine(config, vi.fn()))
    // shape 1: circle (not target)
    act(() => vi.advanceTimersByTime(1000))
    // shape 2: square (not target, circle != square)
    expect(result.current.isTarget).toBe(false)
  })

  it('records a miss when a target shape is not responded to', () => {
    mockCircle()
    const { result } = renderHook(() => useVltaEngine(config, vi.fn()))
    // shape 2 (target) shows at t=1000ms and hides at t=1300ms
    act(() => vi.advanceTimersByTime(1300))
    expect(result.current.missCount).toBe(1)
    expect(result.current.events.some((e) => e.type === 'miss')).toBe(true)
  })

  it('no miss when non-target shape is not responded to', () => {
    mockAlternating()
    const { result } = renderHook(() => useVltaEngine(config, vi.fn()))
    // shape 1 (circle, non-target) hides at t=300ms; shape 2 (square, non-target) hides at t=1300ms
    act(() => vi.advanceTimersByTime(1300))
    expect(result.current.missCount).toBe(0)
  })

  it('respond() during target records a correct event and no miss', () => {
    mockCircle()
    const { result } = renderHook(() => useVltaEngine(config, vi.fn()))
    act(() => vi.advanceTimersByTime(1000)) // shape 2 (target) appears
    act(() => result.current.respond())
    expect(result.current.events.some((e) => e.type === 'response_correct')).toBe(true)
    act(() => vi.advanceTimersByTime(300)) // let hide timer fire
    expect(result.current.missCount).toBe(0)
  })

  it('respond() during target records a non-negative reactionMs', () => {
    mockCircle()
    const { result } = renderHook(() => useVltaEngine(config, vi.fn()))
    act(() => vi.advanceTimersByTime(1000)) // target appears
    act(() => {
      vi.advanceTimersByTime(100)
      result.current.respond()
    })
    const hit = result.current.events.find((e) => e.type === 'response_correct')
    expect(hit?.reactionMs).toBeGreaterThanOrEqual(0)
  })

  it('respond() during non-target records an incorrect event', () => {
    mockAlternating()
    const { result } = renderHook(() => useVltaEngine(config, vi.fn()))
    // shape 1 is circle (non-target)
    act(() => result.current.respond())
    expect(result.current.events.some((e) => e.type === 'response_incorrect')).toBe(true)
    expect(result.current.missCount).toBe(0)
  })

  it('respond() during blank gap records an incorrect event', () => {
    mockCircle()
    const { result } = renderHook(() => useVltaEngine(config, vi.fn()))
    act(() => vi.advanceTimersByTime(300)) // shape 1 hidden
    expect(result.current.currentShape).toBeNull()
    act(() => result.current.respond())
    expect(result.current.events.some((e) => e.type === 'response_incorrect')).toBe(true)
  })

  it('second respond() on same target records a commission error', () => {
    mockCircle()
    const { result } = renderHook(() => useVltaEngine(config, vi.fn()))
    act(() => vi.advanceTimersByTime(1000)) // target
    act(() => result.current.respond()) // first press: correct
    act(() => result.current.respond()) // second press: commission
    expect(result.current.events.filter((e) => e.type === 'response_correct').length).toBe(1)
    expect(result.current.events.some((e) => e.type === 'response_incorrect')).toBe(true)
  })

  it('calls onComplete after maxFailureCount misses', () => {
    mockCircle()
    const onComplete = vi.fn()
    const cfg: TestConfig = { ...config, maxFailureCount: 2 }
    renderHook(() => useVltaEngine(cfg, onComplete))
    // miss 1 at t=1300ms (shape 2 target, unhit)
    // miss 2 at t=2300ms (shape 3 target, unhit) → complete
    act(() => vi.advanceTimersByTime(2300))
    expect(onComplete).toHaveBeenCalledOnce()
  })

  it('calls onComplete after maxDuration elapses', () => {
    const onComplete = vi.fn()
    renderHook(() => useVltaEngine(config, onComplete))
    act(() => vi.advanceTimersByTime(60 * 1000))
    expect(onComplete).toHaveBeenCalledOnce()
  })

  it('does not call onComplete more than once when both limits trigger', () => {
    mockCircle()
    const onComplete = vi.fn()
    const cfg: TestConfig = { ...config, maxFailureCount: 1, maxDurationMin: 1 }
    renderHook(() => useVltaEngine(cfg, onComplete))
    // miss at t=1300ms → complete; maxDuration at t=60000ms is ignored
    act(() => vi.advanceTimersByTime(60 * 1000))
    expect(onComplete).toHaveBeenCalledOnce()
  })

  it('complete flag is true after onComplete fires', () => {
    mockCircle()
    const { result } = renderHook(() =>
      useVltaEngine({ ...config, maxFailureCount: 1 }, vi.fn()),
    )
    act(() => vi.advanceTimersByTime(1300)) // one miss → complete
    expect(result.current.complete).toBe(true)
  })
})

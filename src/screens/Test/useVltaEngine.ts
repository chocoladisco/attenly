import { useState, useEffect, useRef, useCallback } from 'react'
import type { TestConfig, TestEvent, ShapeType } from '../../types/session'
import { randomShape } from './TestEngine'

export interface VltaEngineOutput {
  currentShape: ShapeType | null
  isTarget: boolean
  missCount: number
  events: ReadonlyArray<TestEvent>
  complete: boolean
  respond: () => void
}

export function useVltaEngine(
  config: TestConfig,
  onComplete: (events: ReadonlyArray<TestEvent>) => void,
): VltaEngineOutput {
  const [currentShape, setCurrentShape] = useState<ShapeType | null>(null)
  const [isTarget, setIsTarget] = useState(false)
  const [missCount, setMissCount] = useState(0)
  const [events, setEvents] = useState<ReadonlyArray<TestEvent>>([])
  const [complete, setComplete] = useState(false)

  // Mutable refs so timer callbacks always see current values without re-subscribing.
  const currentShapeRef = useRef<ShapeType | null>(null)
  const isTargetRef = useRef(false)
  const respondedRef = useRef(false)
  const previousShapeRef = useRef<ShapeType | null>(null)
  const eventsRef = useRef<TestEvent[]>([])
  const missCountRef = useRef(0)
  const completeRef = useRef(false)
  const respondRef = useRef<() => void>(() => {})

  useEffect(() => {
    const maxDurationMs = (config.maxDurationMin as number) * 60 * 1000
    const maxFailureCount =
      config.enableMaxMisses === false ? Infinity : (config.maxFailureCount as number)
    const shapeIntervalMs = (config.shapeIntervalSec as number) * 1000
    const shapeDurationMs = config.shapeDurationMs as number
    const gapMs = Math.max(0, shapeIntervalMs - shapeDurationMs)

    let hideTimer: ReturnType<typeof setTimeout> | null = null
    let gapTimer: ReturnType<typeof setTimeout> | null = null

    function addEvent(event: TestEvent) {
      eventsRef.current = [...eventsRef.current, event]
      setEvents(eventsRef.current)
    }

    function finish() {
      if (completeRef.current) return
      completeRef.current = true
      setComplete(true)
      setCurrentShape(null)
      currentShapeRef.current = null
      if (hideTimer) clearTimeout(hideTimer)
      if (gapTimer) clearTimeout(gapTimer)
      onComplete(eventsRef.current)
    }

    function showShape() {
      if (completeRef.current) return
      const shape = randomShape()
      const target = shape === previousShapeRef.current
      previousShapeRef.current = shape
      currentShapeRef.current = shape
      isTargetRef.current = target
      respondedRef.current = false
      setCurrentShape(shape)
      setIsTarget(target)
      addEvent({ type: 'shape_shown', timestampMs: Date.now(), shape, isTarget: target })

      hideTimer = setTimeout(() => {
        if (completeRef.current) return
        if (isTargetRef.current && !respondedRef.current) {
          addEvent({ type: 'miss', timestampMs: Date.now() })
          missCountRef.current += 1
          setMissCount(missCountRef.current)
          if (missCountRef.current >= maxFailureCount) {
            finish()
            return
          }
        }
        currentShapeRef.current = null
        setCurrentShape(null)
        gapTimer = setTimeout(showShape, gapMs)
      }, shapeDurationMs)
    }

    respondRef.current = function () {
      if (completeRef.current) return
      const now = Date.now()
      if (currentShapeRef.current !== null) {
        if (isTargetRef.current && !respondedRef.current) {
          respondedRef.current = true
          const lastShown = [...eventsRef.current].reverse().find((e) => e.type === 'shape_shown')
          const reactionMs = lastShown ? now - lastShown.timestampMs : undefined
          addEvent({ type: 'response_correct', timestampMs: now, reactionMs })
        } else {
          addEvent({ type: 'response_incorrect', timestampMs: now })
        }
      } else {
        addEvent({ type: 'response_incorrect', timestampMs: now })
      }
    }

    showShape()
    const maxTimer = setTimeout(finish, maxDurationMs)

    return () => {
      completeRef.current = true
      if (hideTimer) clearTimeout(hideTimer)
      if (gapTimer) clearTimeout(gapTimer)
      clearTimeout(maxTimer)
    }
  }, []) // config is fixed for the lifetime of a test run

  const respond = useCallback(() => {
    respondRef.current()
  }, [])

  return { currentShape, isTarget, missCount, events, complete, respond }
}

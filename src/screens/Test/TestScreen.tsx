import { useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useSession } from '../../context/SessionContext'
import { getTestById } from '../../data/testCatalogue'
import { buildDefaultConfig, computeResult } from './TestEngine'
import { useVltaEngine } from './useVltaEngine'
import { Button } from '../../components/Button/Button'
import type { TestEvent, ShapeType } from '../../types/session'

export function TestScreen() {
  const { testId } = useParams<{ testId: string }>()
  const navigate = useNavigate()
  const { state, dispatch } = useSession()
  const { t } = useTranslation()

  const test = getTestById(testId ?? '')
  const config = state.config ?? (test ? buildDefaultConfig(test) : {})

  const handleComplete = useCallback(
    (events: ReadonlyArray<TestEvent>) => {
      const result = computeResult(events, config, testId ?? '')
      dispatch({ type: 'RECORD_RESULT', result })
      navigate(`/tests/${testId}/results`)
    },
    // config and testId are stable for the lifetime of a test run
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const { currentShape, respond } = useVltaEngine(config, handleComplete)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        respond()
      }
    },
    [respond],
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  function handleAbort(e: React.MouseEvent) {
    e.stopPropagation()
    navigate(`/tests/${testId}/configure`)
  }

  return (
    <div
      style={{ minHeight: '100vh', maxWidth: '700px', margin: '0 auto', textAlign: 'center', paddingTop: '2rem' }}
      onClick={respond}
    >
      <h2
        style={{
          fontFamily: 'monospace',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          letterSpacing: '0.05em',
          marginBottom: '1rem',
        }}
      >
        {t('testScreen.title')}
      </h2>

      <div
        style={{
          height: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {currentShape !== null && <ShapeDisplay shape={currentShape} />}
      </div>

      <p
        style={{
          fontFamily: 'monospace',
          fontSize: '0.875rem',
          color: '#555',
          marginBottom: '2rem',
        }}
      >
        {t('testScreen.instructions')}
      </p>

      <Button variant="danger" onClick={handleAbort}>
        {t('testScreen.abort')}
      </Button>
    </div>
  )
}

function ShapeDisplay({ shape }: { shape: ShapeType }) {
  return (
    <svg
      data-testid="shape-display"
      data-shape={shape}
      viewBox="0 0 100 100"
      style={{ width: '60vh', height: '60vh', maxWidth: '60vw', maxHeight: '60vw' }}
      aria-label={shape}
    >
      {shape === 'circle' && <circle cx="50" cy="50" r="48" fill="white" />}
      {shape === 'square' && <rect x="4" y="4" width="92" height="92" fill="white" />}
      {shape === 'triangle' && <polygon points="50,4 96,96 4,96" fill="white" />}
    </svg>
  )
}

import { describe, it, expect, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router'
import { SessionProvider, useSession } from '../../context/SessionContext'
import { ResultsScreen } from './ResultsScreen'
import type { TestResult } from '../../types/session'

const MOCK_RESULT: TestResult = {
  testId: 'vlta',
  config: { maxDurationMin: 5 },
  score: 85,
  accuracy: 0.9,
  reactionTimeMs: 320,
  hits: 3,
  misses: 1,
  commissions: 1,
  completedAt: 10_000,
  rawEvents: [
    { type: 'shape_shown', timestampMs: 0, shape: 'circle', isTarget: false },
    { type: 'shape_shown', timestampMs: 1000, shape: 'circle', isTarget: true },
    { type: 'response_correct', timestampMs: 1250, reactionMs: 250 },
    { type: 'shape_shown', timestampMs: 2000, shape: 'square', isTarget: false },
    { type: 'shape_shown', timestampMs: 3000, shape: 'square', isTarget: true },
    { type: 'response_correct', timestampMs: 3350, reactionMs: 350 },
    { type: 'shape_shown', timestampMs: 4000, shape: 'triangle', isTarget: false },
    { type: 'shape_shown', timestampMs: 5000, shape: 'triangle', isTarget: true },
    { type: 'miss', timestampMs: 5500 },
    { type: 'response_incorrect', timestampMs: 6000 },
  ],
}

function Seeder({ children }: { children: React.ReactNode }) {
  const { dispatch } = useSession()
  return (
    <div>
      <button onClick={() => dispatch({ type: 'RECORD_RESULT', result: MOCK_RESULT })}>
        seed
      </button>
      {children}
    </div>
  )
}

function renderWithResult(withResult = false) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <SessionProvider>
        <Seeder>{children}</Seeder>
      </SessionProvider>
    )
  }

  const utils = render(
    <MemoryRouter initialEntries={['/tests/vlta/results']}>
      <Routes>
        <Route path="/tests/:testId/results" element={<ResultsScreen />} />
        <Route path="/tests/:testId/configure" element={<div>Configure</div>} />
        <Route path="/" element={<div>Home</div>} />
      </Routes>
    </MemoryRouter>,
    { wrapper: Wrapper },
  )

  if (withResult) {
    act(() => {
      screen.getByRole('button', { name: 'seed' }).click()
    })
  }

  return utils
}

describe('ResultsScreen', () => {
  it('renders a heading', () => {
    renderWithResult()
    expect(screen.getByRole('heading')).toBeInTheDocument()
  })

  it('renders a "Home" button', () => {
    renderWithResult()
    expect(screen.getByRole('button', { name: /home/i })).toBeInTheDocument()
  })

  it('renders a "Try Again" button', () => {
    renderWithResult()
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
  })

  it('navigates to / when Home is clicked', async () => {
    const user = userEvent.setup()
    renderWithResult()
    await user.click(screen.getByRole('button', { name: /home/i }))
    expect(screen.getByText('Home')).toBeInTheDocument()
  })

  it('navigates to configure when Try Again is clicked', async () => {
    const user = userEvent.setup()
    renderWithResult()
    await user.click(screen.getByRole('button', { name: /try again/i }))
    expect(screen.getByText('Configure')).toBeInTheDocument()
  })

  it('shows a no-results message when result is null', () => {
    renderWithResult()
    expect(screen.getByText(/no results/i)).toBeInTheDocument()
  })

  it('does not render a "Download CSV" button when result is null', () => {
    renderWithResult()
    expect(screen.queryByRole('button', { name: /download csv/i })).toBeNull()
  })

  describe('with result data', () => {
    it('renders the reaction-time chart', () => {
      renderWithResult(true)
      expect(screen.getByTestId('reaction-time-chart')).toBeInTheDocument()
    })

    it('renders the event timeline', () => {
      renderWithResult(true)
      expect(screen.getByTestId('event-timeline')).toBeInTheDocument()
    })

    it('shows the score', () => {
      renderWithResult(true)
      expect(screen.getByText('85')).toBeInTheDocument()
    })

    it('shows the average reaction time', () => {
      renderWithResult(true)
      expect(screen.getByText('320 ms')).toBeInTheDocument()
    })

    it('shows hit and miss counts', () => {
      renderWithResult(true)
      expect(screen.getByText('3')).toBeInTheDocument() // hits
      // misses=1 and commissions=1 both render "1" — use getAllByText
      expect(screen.getAllByText('1').length).toBeGreaterThanOrEqual(1)
    })

    it('reaction-time chart contains one dot per response_correct event', () => {
      renderWithResult(true)
      const hitCount = MOCK_RESULT.rawEvents.filter(
        (e) => e.type === 'response_correct' && e.reactionMs != null,
      ).length
      const chart = screen.getByTestId('reaction-time-chart')
      const dots = chart.querySelectorAll('circle')
      expect(dots.length).toBe(hitCount)
    })

    it('renders a "Download CSV" button', () => {
      renderWithResult(true)
      expect(screen.getByRole('button', { name: /download csv/i })).toBeInTheDocument()
    })

    it('clicking Download CSV calls URL.createObjectURL', async () => {
      const createObjectURL = vi.fn(() => 'blob:mock')
      const revokeObjectURL = vi.fn()
      URL.createObjectURL = createObjectURL
      URL.revokeObjectURL = revokeObjectURL

      const user = userEvent.setup()
      renderWithResult(true)
      await user.click(screen.getByRole('button', { name: /download csv/i }))
      expect(createObjectURL).toHaveBeenCalledOnce()
    })

    it('event timeline contains one marker per non-shape event', () => {
      renderWithResult(true)
      const timeline = screen.getByTestId('event-timeline')
      const dots = timeline.querySelectorAll('circle')
      const expected = MOCK_RESULT.rawEvents.filter(
        (e) =>
          e.type === 'response_correct' ||
          e.type === 'response_incorrect' ||
          e.type === 'miss',
      ).length
      expect(dots.length).toBe(expected)
    })
  })
})

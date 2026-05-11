import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router'
import { SessionProvider } from '../../context/SessionContext'
import { TestScreen } from './TestScreen'

function renderScreen() {
  return render(
    <SessionProvider>
      <MemoryRouter initialEntries={['/tests/vlta/run']}>
        <Routes>
          <Route path="/tests/:testId/run" element={<TestScreen />} />
          <Route path="/tests/:testId/configure" element={<div>Configure</div>} />
          <Route path="/tests/:testId/results" element={<div>Results</div>} />
        </Routes>
      </MemoryRouter>
    </SessionProvider>,
  )
}

describe('TestScreen', () => {
  it('renders a heading indicating the test is running', () => {
    renderScreen()
    expect(screen.getByRole('heading')).toBeInTheDocument()
  })

  it('renders an abort button', () => {
    renderScreen()
    expect(screen.getByRole('button', { name: /abort/i })).toBeInTheDocument()
  })

  it('navigates back to configure when abort is clicked', async () => {
    const user = userEvent.setup()
    renderScreen()
    await user.click(screen.getByRole('button', { name: /abort/i }))
    expect(screen.getByText('Configure')).toBeInTheDocument()
  })

  it('renders the shape display immediately', () => {
    renderScreen()
    expect(screen.getByTestId('shape-display')).toBeInTheDocument()
  })

  it('shape display has a valid shape type', () => {
    renderScreen()
    const el = screen.getByTestId('shape-display')
    expect(['circle', 'square', 'triangle']).toContain(el.getAttribute('data-shape'))
  })

  it('pressing Space does not throw', () => {
    renderScreen()
    expect(() => fireEvent.keyDown(window, { key: ' ' })).not.toThrow()
  })

  it('pressing Enter does not throw', () => {
    renderScreen()
    expect(() => fireEvent.keyDown(window, { key: 'Enter' })).not.toThrow()
  })

  describe('with fake timers', () => {
    beforeEach(() => vi.useFakeTimers())
    afterEach(() => vi.useRealTimers())

    it('navigates to results when the engine completes via max duration', () => {
      renderScreen()
      // Default config: maxDurationMin=5 → 300 000ms
      act(() => vi.advanceTimersByTime(300_001))
      expect(screen.getByText('Results')).toBeInTheDocument()
    })
  })
})

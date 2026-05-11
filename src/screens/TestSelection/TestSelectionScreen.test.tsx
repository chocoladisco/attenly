import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router'
import { SessionProvider } from '../../context/SessionContext'
import { testCatalogue } from '../../data/testCatalogue'
import { TestSelectionScreen } from './TestSelectionScreen'

function renderScreen() {
  return render(
    <SessionProvider>
      <MemoryRouter initialEntries={['/tests']}>
        <Routes>
          <Route path="/tests" element={<TestSelectionScreen />} />
          <Route path="/tests/:testId/configure" element={<div>Configure</div>} />
        </Routes>
      </MemoryRouter>
    </SessionProvider>,
  )
}

describe('TestSelectionScreen', () => {
  it('renders a heading', () => {
    renderScreen()
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
  })

  it('renders a card for each test in the catalogue', () => {
    renderScreen()
    for (const test of testCatalogue) {
      expect(screen.getByText(test.name)).toBeInTheDocument()
    }
  })

  it('renders each test description', () => {
    renderScreen()
    for (const test of testCatalogue) {
      expect(screen.getByText(test.description)).toBeInTheDocument()
    }
  })

  it('renders a "Configure" button for each test', () => {
    renderScreen()
    const buttons = screen.getAllByRole('button', { name: /configure/i })
    expect(buttons).toHaveLength(testCatalogue.length)
  })

  it('navigates to configure screen when Configure is clicked', async () => {
    const user = userEvent.setup()
    renderScreen()
    await user.click(screen.getAllByRole('button', { name: /configure/i })[0])
    expect(screen.getByText('Configure')).toBeInTheDocument()
  })
})

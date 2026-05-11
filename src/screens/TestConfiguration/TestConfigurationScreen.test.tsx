import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router'
import { SessionProvider } from '../../context/SessionContext'
import { getTestById } from '../../data/testCatalogue'
import { TestConfigurationScreen } from './TestConfigurationScreen'

function renderScreen() {
  return render(
    <SessionProvider>
      <MemoryRouter initialEntries={['/tests/vlta/configure']}>
        <Routes>
          <Route path="/tests/:testId/configure" element={<TestConfigurationScreen />} />
          <Route path="/tests/:testId/run" element={<div>Test Running</div>} />
          <Route path="/tests" element={<div>Test Selection</div>} />
        </Routes>
      </MemoryRouter>
    </SessionProvider>,
  )
}

describe('TestConfigurationScreen', () => {
  const vlta = getTestById('vlta')!

  it('renders the test name', () => {
    renderScreen()
    expect(screen.getByText(vlta.name)).toBeInTheDocument()
  })

  it('renders a label for each config field', () => {
    renderScreen()
    for (const field of vlta.configSchema) {
      expect(screen.getByText(new RegExp(field.label, 'i'))).toBeInTheDocument()
    }
  })

  it('renders an input for each config field with its default value', () => {
    renderScreen()
    for (const field of vlta.configSchema) {
      if (field.dependsOn && !vlta.configSchema.find((f) => f.key === field.dependsOn)?.defaultValue) continue
      const input = screen.getByLabelText(new RegExp(field.label, 'i'))
      expect(input).toBeInTheDocument()
      if (field.type === 'toggle') {
        expect((input as HTMLInputElement).checked).toBe(Boolean(field.defaultValue))
      } else {
        expect((input as HTMLInputElement).value).toBe(String(field.defaultValue))
      }
    }
  })

  it('renders a "Start Test" button', () => {
    renderScreen()
    expect(screen.getByRole('button', { name: /start test/i })).toBeInTheDocument()
  })

  it('renders a back button', () => {
    renderScreen()
    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument()
  })

  it('navigates to run screen when "Start Test" is clicked', async () => {
    const user = userEvent.setup()
    renderScreen()
    await user.click(screen.getByRole('button', { name: /start test/i }))
    expect(screen.getByText('Test Running')).toBeInTheDocument()
  })

  it('navigates back to test selection when back is clicked', async () => {
    const user = userEvent.setup()
    renderScreen()
    await user.click(screen.getByRole('button', { name: /back/i }))
    expect(screen.getByText('Test Selection')).toBeInTheDocument()
  })
})

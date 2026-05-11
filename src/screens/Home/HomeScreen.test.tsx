import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router'
import { HomeScreen } from './HomeScreen'

function renderHomeScreen() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/tests" element={<div>Test Selection</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('HomeScreen', () => {
  it('renders the app name "Attenly"', () => {
    renderHomeScreen()
    expect(screen.getByRole('heading', { name: /attenly/i })).toBeInTheDocument()
  })

  it('renders a description', () => {
    renderHomeScreen()
    expect(screen.getByText(/attention/i)).toBeInTheDocument()
  })

  it('renders a "Select a Test" button', () => {
    renderHomeScreen()
    expect(screen.getByRole('button', { name: /select a test/i })).toBeInTheDocument()
  })

  it('navigates to /tests when "Select a Test" is clicked', async () => {
    const user = userEvent.setup()
    renderHomeScreen()
    await user.click(screen.getByRole('button', { name: /select a test/i }))
    expect(screen.getByText('Test Selection')).toBeInTheDocument()
  })
})

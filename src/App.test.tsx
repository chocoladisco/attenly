import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, it, expect } from 'vitest'
import App from './App'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

describe('App', () => {
  it('renders HomeScreen at /', () => {
    renderAt('/')
    expect(screen.getByRole('heading', { name: /attenly/i, level: 1 })).toBeInTheDocument()
  })

  it('renders TestSelectionScreen at /tests', () => {
    renderAt('/tests')
    expect(screen.getByRole('heading', { name: /select a test/i })).toBeInTheDocument()
  })

  it('renders TestConfigurationScreen at /tests/:testId/configure', () => {
    renderAt('/tests/vlta/configure')
    expect(screen.getByRole('button', { name: /start test/i })).toBeInTheDocument()
  })

  it('renders TestScreen at /tests/:testId/run', () => {
    renderAt('/tests/vlta/run')
    expect(screen.getByRole('heading', { name: /test in progress/i })).toBeInTheDocument()
  })

  it('renders ResultsScreen at /tests/:testId/results', () => {
    renderAt('/tests/vlta/results')
    expect(screen.getByRole('heading', { name: /results/i })).toBeInTheDocument()
  })

  it('renders 404 for unknown routes', () => {
    renderAt('/does-not-exist')
    expect(screen.getByText(/404/i)).toBeInTheDocument()
  })

  it('renders the AppLayout nav on every route', () => {
    renderAt('/')
    expect(document.querySelector('nav')).not.toBeNull()
  })
})

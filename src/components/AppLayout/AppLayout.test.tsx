import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router'
import { AppLayout } from './AppLayout'

function renderLayout() {
  render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<span data-testid="child">child content</span>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('AppLayout', () => {
  it('renders the app name "Attenly"', () => {
    renderLayout()
    expect(screen.getByText('Attenly')).toBeDefined()
  })

  it('renders outlet content', () => {
    renderLayout()
    expect(screen.getByTestId('child')).toBeDefined()
  })

  it('renders a nav element', () => {
    renderLayout()
    expect(document.querySelector('nav')).not.toBeNull()
  })

  it('renders a main element', () => {
    renderLayout()
    expect(document.querySelector('main')).not.toBeNull()
  })
})

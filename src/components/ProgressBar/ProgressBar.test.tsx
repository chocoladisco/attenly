import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { ProgressBar } from './ProgressBar'

describe('ProgressBar', () => {
  it('renders an element with role="progressbar"', () => {
    const { getByRole } = render(<ProgressBar value={0.5} />)
    expect(getByRole('progressbar')).toBeDefined()
  })

  it('sets aria-valuenow to the percentage (0–100)', () => {
    const { getByRole } = render(<ProgressBar value={0.75} />)
    expect(getByRole('progressbar').getAttribute('aria-valuenow')).toBe('75')
  })

  it('sets aria-valuemin to 0 and aria-valuemax to 100', () => {
    const { getByRole } = render(<ProgressBar value={0.5} />)
    const el = getByRole('progressbar')
    expect(el.getAttribute('aria-valuemin')).toBe('0')
    expect(el.getAttribute('aria-valuemax')).toBe('100')
  })

  it('clamps value below 0 to 0', () => {
    const { getByRole } = render(<ProgressBar value={-0.5} />)
    expect(getByRole('progressbar').getAttribute('aria-valuenow')).toBe('0')
  })

  it('clamps value above 1 to 100', () => {
    const { getByRole } = render(<ProgressBar value={1.5} />)
    expect(getByRole('progressbar').getAttribute('aria-valuenow')).toBe('100')
  })

  it('accepts an optional aria-label', () => {
    const { getByRole } = render(<ProgressBar value={0.5} label="Test progress" />)
    expect(getByRole('progressbar').getAttribute('aria-label')).toBe('Test progress')
  })
})

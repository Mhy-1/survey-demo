import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import LoadingSpinner from '../LoadingSpinner'

describe('LoadingSpinner', () => {
  it('renders loading spinner by default', () => {
    render(<LoadingSpinner />)
    expect(screen.getByText(/جاري التحميل/i)).toBeInTheDocument()
  })

  it('renders custom message when provided', () => {
    render(<LoadingSpinner message="تحميل البيانات..." />)
    expect(screen.getByText(/تحميل البيانات/i)).toBeInTheDocument()
  })

  it('renders in fullscreen mode when specified', () => {
    const { container } = render(<LoadingSpinner fullscreen />)
    const spinnerDiv = container.firstChild
    expect(spinnerDiv).toHaveClass('fixed', 'inset-0')
  })

  it('applies custom size class when provided', () => {
    const { container } = render(<LoadingSpinner size="large" />)
    const spinner = container.querySelector('.animate-spin')
    expect(spinner).toHaveClass('h-16', 'w-16')
  })
})

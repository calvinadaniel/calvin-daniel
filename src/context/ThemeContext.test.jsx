import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider, useTheme } from './ThemeContext'

function TestComponent() {
  const { theme, toggle } = useTheme()
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={toggle}>Toggle</button>
    </div>
  )
}

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.className = ''
  })

  it('defaults to dark theme when localStorage is empty', () => {
    render(<ThemeProvider><TestComponent /></ThemeProvider>)
    expect(screen.getByTestId('theme').textContent).toBe('dark')
  })

  it('adds dark class to html element on dark theme', () => {
    render(<ThemeProvider><TestComponent /></ThemeProvider>)
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('toggles to light theme and removes dark class', async () => {
    render(<ThemeProvider><TestComponent /></ThemeProvider>)
    await userEvent.click(screen.getByRole('button', { name: 'Toggle' }))
    expect(screen.getByTestId('theme').textContent).toBe('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('persists chosen theme to localStorage', async () => {
    render(<ThemeProvider><TestComponent /></ThemeProvider>)
    await userEvent.click(screen.getByRole('button', { name: 'Toggle' }))
    expect(localStorage.getItem('theme')).toBe('light')
  })

  it('reads initial theme from localStorage', () => {
    localStorage.setItem('theme', 'light')
    render(<ThemeProvider><TestComponent /></ThemeProvider>)
    expect(screen.getByTestId('theme').textContent).toBe('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('toggles back to dark from light', async () => {
    localStorage.setItem('theme', 'light')
    render(<ThemeProvider><TestComponent /></ThemeProvider>)
    await userEvent.click(screen.getByRole('button', { name: 'Toggle' }))
    expect(screen.getByTestId('theme').textContent).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })
})

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider } from '../context/ThemeContext'
import ProjectsPage from './ProjectsPage'

function Wrapper({ children }) {
  return (
    <MemoryRouter>
      <ThemeProvider>{children}</ThemeProvider>
    </MemoryRouter>
  )
}

describe('ProjectsPage', () => {
  it('renders all projects by default', () => {
    render(<ProjectsPage />, { wrapper: Wrapper })
    const cards = document.querySelectorAll('[data-category]')
    expect(cards.length).toBe(4)
  })

  it('shows only Web Dev projects when Web Dev filter is clicked', async () => {
    render(<ProjectsPage />, { wrapper: Wrapper })
    await userEvent.click(screen.getByRole('button', { name: 'Web Dev' }))
    const cards = document.querySelectorAll('[data-category]')
    cards.forEach(card => {
      expect(card.getAttribute('data-category')).toBe('Web Dev')
    })
  })

  it('shows only Data / Analytics projects when that filter is clicked', async () => {
    render(<ProjectsPage />, { wrapper: Wrapper })
    await userEvent.click(screen.getByRole('button', { name: 'Data / Analytics' }))
    const cards = document.querySelectorAll('[data-category]')
    cards.forEach(card => {
      expect(card.getAttribute('data-category')).toBe('Data / Analytics')
    })
  })

  it('shows all projects when All filter is clicked after filtering', async () => {
    render(<ProjectsPage />, { wrapper: Wrapper })
    await userEvent.click(screen.getByRole('button', { name: 'Web Dev' }))
    await userEvent.click(screen.getByRole('button', { name: 'All' }))
    const cards = document.querySelectorAll('[data-category]')
    expect(cards.length).toBe(4)
  })
})

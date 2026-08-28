import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '@/components/theme-provider'
import { ThemeToggle } from '@/components/theme-toggle'

function renderToggle() {
  return render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>,
  )
}

describe('ThemeToggle', () => {
  it('exposes an accessible label', () => {
    renderToggle()
    expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument()
  })

  it('puts the dark class on the document when toggled to dark', async () => {
    const user = userEvent.setup()
    renderToggle()
    const button = screen.getByRole('button', { name: /toggle theme/i })

    await user.click(button)

    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })
})

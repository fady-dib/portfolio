import { render, screen } from '@testing-library/react'
import { Projects } from '@/components/projects'
import { projects } from '@/lib/content'

describe('Projects', () => {
  it('renders every project title in the markup', () => {
    render(<Projects />)
    for (const project of projects) {
      expect(screen.getByText(project.title)).toBeInTheDocument()
    }
  })

  it('links out only for projects that have a url, safely', () => {
    render(<Projects />)
    for (const project of projects.filter((p) => p.url)) {
      const link = screen.getByRole('link', { name: new RegExp(project.title, 'i') })
      expect(link).toHaveAttribute('href', project.url)
      expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'))
      expect(link).toHaveAttribute('target', '_blank')
    }
  })

  it('does not render a link for projects without a url', () => {
    render(<Projects />)
    expect(screen.queryByRole('link', { name: /africell/i })).toBeNull()
  })
})

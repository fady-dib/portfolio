import { render, screen } from '@testing-library/react'
import { About } from '@/components/about'
import { skills, stats } from '@/lib/content'

beforeEach(() => {
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      observe() {}
      disconnect() {}
      unobserve() {}
    },
  )
})

describe('About', () => {
  it('renders every stat title as static text', () => {
    render(<About />)
    for (const stat of stats) {
      expect(screen.getByText(stat.title)).toBeInTheDocument()
    }
  })

  it('renders every skill', () => {
    render(<About />)
    for (const skill of skills) {
      expect(screen.getByText(skill)).toBeInTheDocument()
    }
  })

  it('renders the section landmark with the about id', () => {
    const { container } = render(<About />)
    expect(container.querySelector('section#about')).not.toBeNull()
  })
})

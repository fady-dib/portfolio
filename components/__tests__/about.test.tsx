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

  it('renders every skill exactly once for assistive tech', () => {
    render(<About />)
    for (const skill of skills) {
      // The marquee repeats the list so the loop wraps seamlessly. How many
      // passes it takes is a layout concern that has already changed once, so
      // assert only that it does repeat — and that every pass past the first
      // is aria-hidden, leaving exactly one of each announced.
      const matches = screen.getAllByText(skill)
      expect(matches.length).toBeGreaterThan(1)

      const announced = matches.filter(
        (el) => el.closest('[aria-hidden="true"]') === null,
      )
      expect(announced).toHaveLength(1)
    }
  })

  it('renders the section landmark with the about id', () => {
    const { container } = render(<About />)
    expect(container.querySelector('section#about')).not.toBeNull()
  })
})

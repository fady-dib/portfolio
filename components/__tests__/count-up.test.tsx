import { render, screen } from '@testing-library/react'
import { CountUp } from '@/components/count-up'

beforeEach(() => {
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      // Fires synchronously from the constructor, which is the harshest
      // ordering the hook has to survive.
      constructor(
        cb: (entries: { isIntersecting: boolean }[], observer: { disconnect: () => void }) => void,
      ) {
        cb([{ isIntersecting: true }], this)
      }
      observe() {}
      disconnect() {}
      unobserve() {}
    },
  )
})

function mockReducedMotion(reduced: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockReturnValue({
      matches: reduced,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
  )
}

describe('CountUp', () => {
  it('renders the final value immediately when motion is reduced', () => {
    mockReducedMotion(true)
    render(<CountUp value={20} />)
    expect(screen.getByText('20')).toBeInTheDocument()
  })

  it('reaches the final value once the animation completes', async () => {
    mockReducedMotion(false)
    render(<CountUp value={15} />)
    expect(await screen.findByText('15', {}, { timeout: 3000 })).toBeInTheDocument()
  })
})

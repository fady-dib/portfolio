import { render, screen } from '@testing-library/react'
import { act } from 'react'
import { useInView } from '@/lib/use-in-view'

type Entry = { isIntersecting: boolean }
type Callback = (entries: Entry[], observer: { disconnect: () => void }) => void

let trigger: (entries: Entry[]) => void
const disconnect = vi.fn()

beforeEach(() => {
  disconnect.mockClear()
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      // Mirrors the real API: the callback receives the observer itself as
      // its second argument.
      constructor(cb: Callback) {
        trigger = (entries) => cb(entries, this)
      }
      observe() {}
      disconnect = disconnect
      unobserve() {}
    },
  )
})

function Probe() {
  const { ref, inView } = useInView<HTMLDivElement>()
  return <div ref={ref} data-testid="probe" data-in-view={inView} />
}

describe('useInView', () => {
  it('starts out of view', () => {
    render(<Probe />)
    expect(screen.getByTestId('probe')).toHaveAttribute('data-in-view', 'false')
  })

  it('latches to in view and disconnects the observer', () => {
    render(<Probe />)
    act(() => trigger([{ isIntersecting: true }]))
    expect(screen.getByTestId('probe')).toHaveAttribute('data-in-view', 'true')
    expect(disconnect).toHaveBeenCalled()
  })

  it('stays in view after the element leaves again', () => {
    render(<Probe />)
    act(() => trigger([{ isIntersecting: true }]))
    act(() => trigger([{ isIntersecting: false }]))
    expect(screen.getByTestId('probe')).toHaveAttribute('data-in-view', 'true')
  })
})

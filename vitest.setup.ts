import '@testing-library/jest-dom/vitest'

// jsdom implements no media query engine, and both next-themes and the
// prefers-reduced-motion checks call matchMedia during render. Default to
// "query does not match"; individual tests override this where the answer
// changes what is asserted.
// jsdom implements no IntersectionObserver either. This inert default lets
// any component using useInView render; tests that assert on intersection
// stub their own observer over the top.
if (!window.IntersectionObserver) {
  window.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return []
    }
    root = null
    rootMargin = ''
    thresholds = []
  } as unknown as typeof window.IntersectionObserver
}

if (!window.matchMedia) {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia
}

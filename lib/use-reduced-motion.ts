'use client'

import { useSyncExternalStore } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

function subscribe(onChange: () => void) {
  const query = window.matchMedia(QUERY)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

/**
 * Tracks the prefers-reduced-motion setting.
 *
 * Read through useSyncExternalStore rather than an effect, so the value is
 * available on the first client render and updates if the visitor changes
 * the setting without reloading. The server snapshot is false: motion is
 * the default, and the client corrects it before paint.
 */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  )
}

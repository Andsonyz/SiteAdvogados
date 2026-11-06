import { useSyncExternalStore } from 'react'

const query = '(prefers-reduced-motion: reduce)'
const subscribe = (notify: () => void) => {
  const media = window.matchMedia(query)
  media.addEventListener('change', notify)
  return () => media.removeEventListener('change', notify)
}

/** Reacts to preference changes without requiring a reload. */
export function useReducedMotion() {
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => true)
}

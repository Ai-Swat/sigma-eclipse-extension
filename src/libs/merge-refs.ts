import { Ref } from 'react'

export function mergeRefs<T>(
  refs: Array<Ref<T> | undefined>
): (instance: T | null) => void {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(value)
      } else if (ref != null) {
        ;(ref as React.MutableRefObject<T | null>).current = value
      }
    })
  }
}


import { onMount } from 'svelte'

export const useWindowFocus = (onFocus: () => void) => {
  onMount(() => {
    const handleOnFocus = () => {
      onFocus()
    }

    window.addEventListener('visibilitychange', handleOnFocus, false)
    window.addEventListener('focus', handleOnFocus, false)

    return () => {
      window.removeEventListener('visibilitychange', handleOnFocus)
      window.removeEventListener('focus', handleOnFocus)
    }
  })
}

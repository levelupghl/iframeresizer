export function debounce(func: () => void, wait: number): () => void {
  let timeout: number | undefined
  return function executedFunction(): void {
    const later = (): void => {
      clearTimeout(timeout)
      func()
    }
    clearTimeout(timeout)
    timeout = window.setTimeout(later, wait)
  }
}

export function debugF<T>(label: string): (obj: T) => T {
  return (obj) => {
    console.debug(label, obj)
    return obj
  }
}

export function unsafeFirst<T>(arr: T[]): T {
  return arr[0]
}

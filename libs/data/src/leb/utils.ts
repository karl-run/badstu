export function stringTimeToDecimalTime(time: string): number {
  const [hour, minute] = time.split(':')

  return +hour + Math.floor(+minute / 60)
}

export function decimalTimeToStringTime(time: number): string {
  const totalMinutes = Math.round(time * 60)
  const h = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60

  const pad = (n: number) => (n < 10 ? `0${n}` : String(n))
  return `${pad(h)}:${pad(m)}`
}

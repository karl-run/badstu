export function stringTimeToDecimalTime(time: string): number {
  const [hour, minute] = time.split(':')
  if (!hour || !minute) throw Error(`${time} is not a valid time format (HH:mm)`)

  return +hour + Math.floor(+minute / 60)
}

export function decimalTimeToStringTime(time: number): string {
  const totalMinutes = Math.round(time * 60)
  const h = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60

  const pad = (n: number) => (n < 10 ? `0${n}` : String(n))
  return `${pad(h)}:${pad(m)}`
}

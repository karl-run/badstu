export function stringTimeToDecimalTime(time: string): number {
  const [hour, minute] = time.split(':')
  if (hour == null || minute == null) throw Error(`${time} is not a valid time format (HH:mm)`)

  return +hour + +minute / 60
}

export function decimalTimeToStringTime(time: number): string {
  const minutes = Math.round(time * 60)
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
}

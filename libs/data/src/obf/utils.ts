export function decimalTimeToStringTime(decimalTime: number): string {
  const [hour, minutes] = decimalTime.toFixed(1).split('.')

  return `${hour.padStart(2, '0')}:${minutes === '0' ? '00' : '30'}`
}

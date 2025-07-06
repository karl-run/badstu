export type BadstuDay = {
  name: string
  details?: string
  date: string
  slots: BadstuSlot[]
}

export type BadstuSlot = {
  // HH:MM
  time: string
  // HH:MM
  timeEnd: string
  // Decimal time representation, e.g. 1.5 for 1:30, 1.25 for 1:15
  decimalTime: number
  // Whole hours, e.g. 1.5 for 1:30, 1.25 for 1:15
  length: number
  // Number of available slots
  available: number
  // Total available slots
  size: number
}

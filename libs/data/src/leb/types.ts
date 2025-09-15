export interface LebDayFetchPayload {
  day: Day
}

export interface Day {
  date: string
  dayType: string
  isClosed: boolean
  slotDuration: number
  slots: Slot[]
}

export interface Slot {
  bookings: Booking[]
  isForMembersOnly: boolean
  isNotAvailable: boolean
  startTime: string
  totalSpots: number
}

export interface Booking {
  debtorName: string
  durationMinutes: number
  invoiceNumber: number
  paymentDate: string
  paymentMethod: string
  paymentTotal: number
  phoneNumber: string
  price: Price
  pspReference: string
  reservationValidTo: string
  spots: string[]
  start: string
  status: string
  taxPercent: number
  userApprovedTerms: boolean
}

export interface Price {
  adult: number
  child: number
}

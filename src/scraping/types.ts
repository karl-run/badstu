export type Availability = { available: number; isFullyBookable: boolean }

export type AvailabilityResult = Record<string, Availability>

export type DateResultTuple = [string, AvailabilityResult]

export type AvailabilityMap = Record<string, number>

export type DateTimesTuple = [string, AvailabilityMap]

export interface ExtractedDay {
  date: string
  times: AvailabilityMap
}

export type AvailabilityMap = Record<string, number>;

export interface ExtractedDay {
  date: string;
  times: AvailabilityMap;
}

export type DateTimesTuple = [string, AvailabilityMap];

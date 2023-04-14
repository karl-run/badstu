import * as R from 'remeda';
import { Prisma } from '.prisma/client';

import prisma from '@/db/prisma';
import { AvailabilityMap, ExtractedDay } from '@/scraping/types';
import { Location, validateLocation } from '@/scraping/metadata';
import { unsafeFirst } from '@/utils/R';

export async function upsertLocation(
  name: Location,
  days?: ExtractedDay[],
  privateDays?: ExtractedDay[],
): Promise<void> {
  const now = new Date();
  await prisma.location.upsert({
    create: {
      name,
      dropins_polled_at: days ? now : undefined,
      dropins: days ? extractedDaysToJson(days) : undefined,
      private: privateDays ? extractedDaysToJson(privateDays) : undefined,
      private_polled_at: privateDays ? now : undefined,
    },
    update: {
      dropins_polled_at: days ? now : undefined,
      dropins: days ? extractedDaysToJson(days) : undefined,
      private: privateDays ? extractedDaysToJson(privateDays) : undefined,
      private_polled_at: privateDays ? now : undefined,
    },
    where: {
      name,
    },
  });
}

export async function getLocation(name: string) {
  const location = prisma.location.findUnique({
    where: { name },
  });

  if (location == null) {
    console.warn(`Someone looked up location ${name}, and it was null. That's weird.`);
  }

  return location;
}

export async function nextAvailableLocation(): Promise<
  [where: Location, when: string, slot: string, available: number] | null
> {
  const nothingAvailable = (count: number) => count === 0;
  const dayToEarliestSlot: (map: AvailabilityMap) => [string, number] = R.createPipe(
    R.omitBy(nothingAvailable),
    R.toPairs,
    R.sortBy(R.first),
    unsafeFirst,
  );
  const daysToEarliestDay: (days: ExtractedDay[]) => [string, [string, number]] = R.createPipe(
    R.sortBy(R.prop('date')),
    R.mapToObj((it) => [it.date, it.times]),
    R.mapValues(dayToEarliestSlot),
    R.toPairs,
    R.sortBy(R.first),
    unsafeFirst,
  );
  const byDateAndSlot = ([date, [slot]]: [string, [string, [string, number]]]) => `${date}:${slot}`;

  const locations = await prisma.location.findMany({
    where: { NOT: { dropins_polled_at: null } },
  });

  const earliestPossibleDay = R.pipe(
    locations,
    R.mapToObj((it) => [it.name, it.dropins]),
    R.mapValues(jsonToExtractedDays),
    R.mapValues(daysToEarliestDay),
    R.toPairs,
    R.sortBy([byDateAndSlot, 'desc']),
    unsafeFirst,
  );

  if (earliestPossibleDay == null) {
    return null;
  }

  const [where, [when, [slot, available]]] = earliestPossibleDay;
  return [validateLocation(where), when, slot, available];
}

export function extractedDaysToJson(questions: ExtractedDay[]): Prisma.JsonArray {
  return questions as unknown as Prisma.JsonArray;
}

export function jsonToExtractedDays(json: Prisma.JsonValue): ExtractedDay[] {
  return json as unknown as ExtractedDay[];
}

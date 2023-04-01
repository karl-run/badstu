import { Prisma } from '.prisma/client';

import prisma from '@/db/prisma';
import { ExtractedDay } from '@/scraping/types';
import { Location } from '@/scraping/metadata';

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
  return prisma.location.findUnique({
    where: {
      name,
    },
  });
}

export function extractedDaysToJson(questions: ExtractedDay[]): Prisma.JsonArray {
  return questions as unknown as Prisma.JsonArray;
}

export function jsonToExtractedDays(json: Prisma.JsonValue): ExtractedDay[] {
  return json as unknown as ExtractedDay[];
}

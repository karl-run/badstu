import * as R from 'remeda';
import { addDays, differenceInDays, formatISO, min } from 'date-fns/fp';
import { flow } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import { parseISO } from 'date-fns';

import {
  Availability,
  AvailabilityMap,
  DateResultTuple,
  DateTimesTuple,
  ExtractedDay,
} from '@/scraping/types';
import { getDayCorrect, toDateString } from '@/utils/date';
import { getLocation, jsonToExtractedDays } from '@/db/location';
import { createEmptyDropinDay } from '@/utils/days';
import { daysToLatestDate, privateToDropInCollissions } from '@/service/booking-utils';
import { Location, locations } from '@/scraping/metadata';

interface LocationResult {
  timestamp: string | null;
  result: DateResultTuple[];
}

export async function getDropins(name: Location): Promise<LocationResult> {
  const location = await getLocation(name);

  if (
    location == null ||
    (location.dropins_polled_at == null && location.private_polled_at == null)
  ) {
    console.warn(`Found no ${name} location`);
    return {
      timestamp: null,
      result: [],
    };
  }

  const dropins = location.dropins ? jsonToExtractedDays(location.dropins) : [];
  const privates = location.private ? jsonToExtractedDays(location.private) : [];
  const isBookable = privateToDropInCollissions(privates);

  console.info(`Getting booking data for ${name} (${dropins.length} days)`);

  const differenceFromNow: (date: Date) => number = differenceInDays(new Date());
  const diffInDaysToNow = flow(daysToLatestDate, O.map(differenceFromNow), O.toNullable)(dropins);

  return {
    timestamp: R.pipe(
      [location.dropins_polled_at, location.private_polled_at],
      R.compact,
      min,
      formatISO,
    ),
    result: R.pipe(
      dropins,
      addEmptyDays(
        diffInDaysToNow ?? 10,
        createEmptyDropinDay(locations[name].dropinSlots),
        locations[name].fillDays,
      ),
      R.map(
        ([date, times]): DateResultTuple => [
          date,
          R.pipe(
            times,
            (it) => R.toPairs(it),
            R.map(([time, available]): [string, Availability] => [
              time,
              { available, isFullyBookable: isBookable(date, time) },
            ]),
            (it) => R.fromPairs(it),
          ),
        ],
      ),
    ),
  };
}

function addEmptyDays(daysToAdd: number, emptyDay: AvailabilityMap, daysToFill?: number[]) {
  return (days: ExtractedDay[]): DateTimesTuple[] => {
    const today = new Date();
    const emptyDays: Record<string, AvailabilityMap> = R.pipe(
      R.range(0, daysToAdd).map((it) => addDays(it, today)),
      R.map((it): DateTimesTuple => [toDateString(it), emptyDay]),
      R.filter(([date]) =>
        daysToFill == null ? true : daysToFill.includes(getDayCorrect(parseISO(date))),
      ),
      (it) => R.fromPairs(it),
    );

    return R.pipe(
      days,
      R.map((it): DateTimesTuple => [it.date, it.times]),
      (it) => R.fromPairs(it),
      (it) => R.merge(emptyDays, it),
      R.toPairs,
    );
  };
}

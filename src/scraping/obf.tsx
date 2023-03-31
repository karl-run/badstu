import { JSDOM } from 'jsdom';
import * as R from 'remeda';
import { formatISOWithOptions, parse } from 'date-fns/fp';

import { ExtractedDay } from '@/scraping/types';
import { upsertLocation } from '@/db/location';
import { emptyDropinDay } from '@/utils/days';
import { fullyLoadDom } from '@/utils/jsdom-utils';
import { createUrl, locations, Locations } from "@/scraping/metadata";

export async function scrapeTimes(name: Locations): Promise<void> {
  const location = locations[name];

  console.time(`Scraping ${name}`);
  console.info(
    `Scraping ${name}, dropin: ${locations[name].dropin ?? 'true'}, private: ${
      locations[name].privat ?? 'true'
    }`,
  );

  const [dropinDays, privateDays] = await Promise.all([
    fullyLoadDom(createUrl(location.dropin, true), 'upcoming-day-group').then(
      getDaysFromDom(false),
    ),
    location.privat != null
      ? fullyLoadDom(createUrl(location.privat, false), 'upcoming-day-group').then(
          getDaysFromDom(true),
        )
      : undefined,
  ]);
  console.timeEnd(`Scraping ${name}`);

  console.time('Updating scrape time in db');
  await upsertLocation(name, dropinDays, privateDays);
  console.timeEnd('Updating scrape time in db');
}

export function getDaysFromDom(isEntireSaunaBooking: boolean) {
  return (dom: JSDOM): ExtractedDay[] =>
    R.pipe(
      dom.window.document.getElementsByClassName('upcoming-day-group'),
      Array.from,
      R.map(dayGroupToDay(isEntireSaunaBooking)),
      R.compact,
    );
}

function dayGroupToDay(isEntireSaunaBooking: boolean) {
  return (dayGroup: Element): ExtractedDay | null => {
    const firstLink = dayGroup.querySelector('.thumbnail')?.getAttribute('onclick');
    const dateFromLink = /start_date=(\d{2}\.\d{2}\.\d{4})/.exec(firstLink ?? '')?.[1];

    if (!dateFromLink) {
      console.warn("Couldn't find date in link, skipping");
      return null;
    }

    const times = R.pipe(dayGroup, getTimesFromDayGroup(isEntireSaunaBooking), (it) =>
      isEntireSaunaBooking ? it : R.merge(emptyDropinDay, it),
    );

    return {
      times,
      date: R.pipe(
        dateFromLink,
        parse(new Date(), 'dd.MM.yyyy'),
        formatISOWithOptions({ representation: 'date' }),
      ),
    };
  };
}

function getTimesFromDayGroup(isEntireSaunaBooking: boolean) {
  return (dayGroup: Element): Record<string, number> =>
    R.fromPairs(
      R.pipe(
        Array.from(dayGroup.getElementsByClassName('thumbnail')),
        R.map(R.prop('textContent')),
        R.compact,
        R.map((it): [string, number] => {
          const [time, available] = it?.split('  ');

          return [
            time.trim(),
            isEntireSaunaBooking ? 1 : parseInt(available.replace('(', '').replace(')', '')),
          ];
        }),
      ),
    );
}

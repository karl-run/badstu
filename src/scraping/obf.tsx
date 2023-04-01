import { JSDOM } from 'jsdom';
import * as R from 'remeda';
import { formatISOWithOptions, parse } from 'date-fns/fp';

import { ExtractedDay } from '@/scraping/types';
import { upsertLocation } from '@/db/location';
import { createEmptyDropinDay } from '@/utils/days';
import { fullyLoadDom } from '@/utils/jsdom-utils';
import { createUrl, locations, Location } from '@/scraping/metadata';

export async function scrapeTimes(name: Location): Promise<void> {
  const location = locations[name];

  console.time(`Scraping ${name}`);
  console.info(
    `Scraping ${name}, dropin: ${locations[name].dropin ?? 'true'}, private: ${
      locations[name].privat ?? 'true'
    }`,
  );

  const [dropinDays, privateDays] = await Promise.all([
    fullyLoadDom(createUrl(location.dropin, true), 'upcoming-day-group').then(
      getDaysFromDom(location.dropinSlots),
    ),
    location.privat != null
      ? fullyLoadDom(createUrl(location.privat, false), 'upcoming-day-group').then(
          getDaysFromDom(null),
        )
      : undefined,
  ]);
  console.timeEnd(`Scraping ${name}`);

  console.time('Updating scrape time in db');
  await upsertLocation(name, dropinDays, privateDays);
  console.timeEnd('Updating scrape time in db');
}

export function getDaysFromDom(fillEmptyHours: string[] | null) {
  return (dom: JSDOM): ExtractedDay[] =>
    R.pipe(
      dom.window.document.getElementsByClassName('upcoming-day-group'),
      Array.from,
      R.map(dayGroupToDay(fillEmptyHours)),
      R.compact,
    );
}

function dayGroupToDay(fillEmptyHours: string[] | null) {
  return (dayGroup: Element): ExtractedDay | null => {
    const firstLink = dayGroup.querySelector('.thumbnail')?.getAttribute('onclick');
    const dateFromLink = /start_date=(\d{2}\.\d{2}\.\d{4})/.exec(firstLink ?? '')?.[1];

    if (!dateFromLink) {
      console.warn("Couldn't find date in link, skipping");
      return null;
    }

    const times = R.pipe(dayGroup, getTimesFromDayGroup(fillEmptyHours == null), (it) =>
      fillEmptyHours == null ? it : R.merge(createEmptyDropinDay(fillEmptyHours), it),
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

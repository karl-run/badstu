import { JSDOM } from 'jsdom';
import * as R from 'remeda';
import { formatISOWithOptions, parse } from 'date-fns/fp';

import { ExtractedDay } from '@/scraping/types';
import { upsertLocation } from '@/db/location';
import { emptyDropinDay } from '@/utils/days';
import { fullyLoadDom } from '@/utils/jsdom-utils';

const KROLOFTET_URL =
  'https://www.planyo.com/embed-calendar.php?resource_id=189283&calendar=57139&style=upcoming-av&modver=2.7&custom-language=NO&ifr=calp_3204143258&usage=resform&clk=r&no_range=1&show_count=1&visible_items_per_column=100';
const KROLOFTET_HELBOOKING_URL =
  'https://www.planyo.com/embed-calendar.php?resource_id=189244&calendar=57139&style=upcoming-av&modver=2.7&custom-language=NO&ifr=calp_902085535&usage=resform&no_range=1&visible_items_per_column=100';

export async function scrapeKroloftetTimes(): Promise<void> {
  console.time('Scraping kroloftet');
  console.info('Scraping both dropin and complete booking from kroloftet');

  const [kroloftetDom, kroloftetFullDom] = await Promise.all([
    fullyLoadDom(KROLOFTET_URL, 'upcoming-day-group'),
    fullyLoadDom(KROLOFTET_HELBOOKING_URL, 'upcoming-day-group'),
  ]);

  const [kroloftetDays, kroloftetFullDays] = await Promise.all([
    getDaysFromDom(kroloftetDom, false),
    getDaysFromDom(kroloftetFullDom, true),
  ]);

  console.timeEnd('Scraping kroloftet');

  console.time('Updating scrape time in db');
  await upsertLocation(kroloftetDays, kroloftetFullDays);
  console.timeEnd('Updating scrape time in db');
}

export async function getDaysFromDom(
  dom: JSDOM,
  isEntireSaunaBooking: boolean,
): Promise<ExtractedDay[]> {
  return R.pipe(
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

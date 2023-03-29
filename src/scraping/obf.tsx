import { JSDOM } from 'jsdom';
import * as R from 'remeda';
import { formatISOWithOptions, parse } from 'date-fns/fp';

import { ExtractedDay } from '@/scraping/types';
import { waitFor } from '@/scraping/utils';
import { upsertLocation } from '@/db/location';
import { emptyDropinDay } from '@/utils/days';

const KROLOFTET_URL =
  'https://www.planyo.com/embed-calendar.php?resource_id=189283&calendar=57139&style=upcoming-av&modver=2.7&custom-language=NO&ifr=calp_3204143258&usage=resform&clk=r&no_range=1&show_count=1&visible_items_per_column=100';
const KROLOFTET_HELBOOKING_URL =
  'https://www.planyo.com/embed-calendar.php?resource_id=189244&calendar=57139&style=upcoming-av&modver=2.7&custom-language=NO&ifr=calp_902085535&usage=resform&no_range=1&visible_items_per_column=100';

async function fullyLoadDom(url: string): Promise<JSDOM> {
  const dom = await getDom(url);
  await waitFor(() => dom.window.document.getElementsByClassName('upcoming-day-group').length > 0);
  return dom;
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

export async function scrapeKroloftetTimes(): Promise<void> {
  console.info('Getting times for Kroloftet');

  const [kroloftetDom, kroloftetFullDom] = await Promise.all([
    fullyLoadDom(KROLOFTET_URL),
    fullyLoadDom(KROLOFTET_HELBOOKING_URL),
  ]);

  const [kroloftetDays, kroloftetFullDays] = await Promise.all([
    getDaysFromDom(kroloftetDom, false),
    getDaysFromDom(kroloftetFullDom, true),
  ]);

  await upsertLocation(kroloftetDays, kroloftetFullDays);
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

async function getDom(url: string): Promise<JSDOM> {
  if (process.env.NODE_ENV === 'development' && (global as any).cache?.[url]) {
    console.info(`Using cached times for ${url}`);
    return (global as any).cache[url];
  }

  const jsdom = await JSDOM.fromURL(url, {
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    resources: 'usable',
  });

  if (process.env.NODE_ENV === 'development') {
    if ((global as any).cache == undefined) (global as any).cache = {};
    (global as any).cache[url] = jsdom;
  }

  return jsdom;
}

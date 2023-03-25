import { JSDOM } from 'jsdom';
import * as R from 'remeda';
import { formatISOWithOptions, parse, addDays } from 'date-fns/fp';

import { Availability, AvailabilityMap, DateResultTuple, DateTimesTuple, ExtractedDay } from '@/scraping/types';
import { waitFor } from '@/scraping/utils';
import { doesBookableCollideWithDropin, toDateString } from '@/utils/date';
import { debugF } from '@/utils/R';

const KROLOFTET_URL =
  'https://www.planyo.com/embed-calendar.php?resource_id=189283&calendar=57139&style=upcoming-av&modver=2.7&custom-language=NO&ifr=calp_3204143258&usage=resform&clk=r&no_range=1&show_count=1&visible_items_per_column=100';
const KROLOFTET_HELBOOKING_URL =
  'https://www.planyo.com/embed-calendar.php?resource_id=189244&calendar=57139&style=upcoming-av&modver=2.7&custom-language=NO&ifr=calp_902085535&usage=resform&no_range=1&visible_items_per_column=100';

const slots = ['08:30', '10:00', '11:30', '13:00', '14:30', '16:00', '17:30', '19:00', '20:30', '22:00'];
const emptyDay: AvailabilityMap = R.pipe(
  slots,
  R.map((it): [string, number] => [it, 0]),
  (it) => R.fromPairs(it),
);

function addEmptyDays(days: ExtractedDay[]): DateTimesTuple[] {
  const today = new Date();
  const emptyDays: Record<string, AvailabilityMap> = R.pipe(
    R.range(0, 10).map((it) => addDays(it, today)),
    R.map((it): DateTimesTuple => [toDateString(it), emptyDay]),
    (it) => R.fromPairs(it),
  );

  return R.pipe(
    days,
    R.map((it): DateTimesTuple => [it.date, it.times]),
    (it) => R.fromPairs(it),
    (it) => R.merge(emptyDays, it),
    R.toPairs,
  );
}

async function fullyLoadDom(url: string): Promise<JSDOM> {
  const dom = await getDom(url);
  await waitFor(() => dom.window.document.getElementsByClassName('upcoming-day-group').length > 0);
  return dom;
}

export async function getDaysFromDom(dom: JSDOM, isEntireSaunaBooking: boolean): Promise<ExtractedDay[]> {
  return R.pipe(
    dom.window.document.getElementsByClassName('upcoming-day-group'),
    Array.from,
    R.map(dayGroupToDay(isEntireSaunaBooking)),
    R.compact,
  );
}

export async function getTimes(): Promise<DateResultTuple[]> {
  console.info('Getting times for Kroloftet');

  const [kroloftetDom, kroloftetFullDom] = await Promise.all([
    fullyLoadDom(KROLOFTET_URL),
    fullyLoadDom(KROLOFTET_HELBOOKING_URL),
  ]);

  const [kroloftetDays, kroloftetFullDays] = await Promise.all([
    getDaysFromDom(kroloftetDom, false),
    getDaysFromDom(kroloftetFullDom, true),
  ]);

  const lookUpFullyBookability = (date: string, time: string): boolean => {
    return (
      kroloftetFullDays.find((fullbookableDay) => {
        if (fullbookableDay.date !== date) return false;

        return R.keys(fullbookableDay.times).some((fullbookableTime) =>
          doesBookableCollideWithDropin(date, time, fullbookableTime),
        );
      }) != null
    );
  };

  console.info(`Got times for Kroloftet (${kroloftetDays.length} days)`);

  return R.pipe(
    kroloftetDays,
    addEmptyDays,
    R.map(
      ([date, times]): DateResultTuple => [
        date,
        R.pipe(
          times,
          (it) => R.toPairs(it),
          R.map(([time, available]): [string, Availability] => [
            time,
            { available, isFullyBookable: lookUpFullyBookability(date, time) },
          ]),
          (it) => R.fromPairs(it),
        ),
      ],
    ),
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
      isEntireSaunaBooking ? it : R.merge(emptyDay, it),
    );

    return {
      times,
      date: R.pipe(dateFromLink, parse(new Date(), 'dd.MM.yyyy'), formatISOWithOptions({ representation: 'date' })),
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

          return [time.trim(), isEntireSaunaBooking ? 1 : parseInt(available.replace('(', '').replace(')', ''))];
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

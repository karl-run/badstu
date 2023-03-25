import { JSDOM } from 'jsdom';
import * as R from 'remeda';
import { formatISOWithOptions, parse, addDays } from 'date-fns/fp';

import { AvailabilityMap, DateTimesTuple, ExtractedDay } from '@/scraping/types';
import { waitFor } from '@/scraping/utils';
import { toDateString } from '@/utils/date';
import { debugF } from '@/utils/R';

const KROLOFTET_URL =
  'https://www.planyo.com/embed-calendar.php?resource_id=189283&calendar=57139&style=upcoming-av&&modver=2.7&custom-language=NO&ifr=calp_3204143258&usage=resform&clk=r&no_range=1&show_count=1&show_prep_time=1&visible_items_per_column=100';

const slots = ['08:30', '10:00', '11:30', '13:00', '14:30', '16:00', '17:30', '19:00', '20:30', '22:00'];
const emptyDay: AvailabilityMap = R.pipe(
  slots,
  R.map((it): [string, number] => [it, 0]),
  (it) => R.fromPairs(it),
);

export async function getTimes(): Promise<DateTimesTuple[]> {
  console.info('Getting times for Kroloftet');

  const dom = await getDom(KROLOFTET_URL);
  await waitFor(() => dom.window.document.getElementsByClassName('upcoming-day-group').length > 0);

  const dayGroups = Array.from(dom.window.document.getElementsByClassName('upcoming-day-group')).map(dayGroupToDay);
  const days = R.compact(dayGroups);

  console.info(`Got times for Kroloftet (${days.length} days)`);

  const today = new Date();
  const emptyDays = R.pipe(
    R.range(0, 10).map((it) => addDays(it, today)),
    R.map((it): DateTimesTuple => [toDateString(it), emptyDay]),
    R.fromPairs,
  );

  return R.pipe(
    days,
    R.map((it): DateTimesTuple => [it.date, it.times]),
    (it) => R.fromPairs(it),
    (it) => R.merge(emptyDays, it),
    R.toPairs,
  );
}

function dayGroupToDay(dayGroup: Element): ExtractedDay | null {
  const firstLink = dayGroup.querySelector('.thumbnail')?.getAttribute('onclick');
  const dateFromLink = /start_date=(\d{2}\.\d{2}\.\d{4})/.exec(firstLink ?? '')?.[1];

  if (!dateFromLink) {
    console.warn("Couldn't find date in link, skipping");
    return null;
  }

  const times = R.pipe(dayGroup, getTimesFromDayGroup, (it) => R.merge(emptyDay, it));

  return {
    times,
    date: R.pipe(dateFromLink, parse(new Date(), 'dd.MM.yyyy'), formatISOWithOptions({ representation: 'date' })),
  };
}

function getTimesFromDayGroup(dayGroup: Element): Record<string, number> {
  return R.fromPairs(
    R.pipe(
      Array.from(dayGroup.getElementsByClassName('thumbnail')),
      R.map(R.prop('textContent')),
      R.compact,
      R.map((it): [string, number] => {
        const [time, available] = it?.split('  ');

        return [time, parseInt(available.replace('(', '').replace(')', ''))];
      }),
    ),
  );
}

async function getDom(url: string): Promise<JSDOM> {
  if (process.env.NODE_ENV === 'development' && (global as any).cache) {
    console.info('Using cached times');
    return (global as any).cache;
  }

  const jsdom = await JSDOM.fromURL(url, {
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    resources: 'usable',
  });

  if (process.env.NODE_ENV === 'development') {
    (global as any).cache = jsdom;
  }

  return jsdom;
}

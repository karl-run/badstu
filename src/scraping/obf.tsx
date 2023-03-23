import { JSDOM } from 'jsdom';
import * as R from 'remeda';

import { debugF } from '@/utils/R';

const KROLOFTET_URL =
  'https://www.planyo.com/embed-calendar.php?resource_id=189283&calendar=57139&style=upcoming-av&&modver=2.7&custom-language=NO&ifr=calp_3204143258&usage=resform&clk=r&no_range=1&show_count=1&show_prep_time=1&visible_items_per_column=100';

const slots = ['08:30', '10:00', '11:30', '13:00', '14:30', '16:00', '17:30', '19:00', '20:30', '22:00'];
const emptyDay = R.pipe(
  slots,
  R.map((it): [string, number] => [it, 0]),
  R.fromPairs,
);

export async function getTimes(): Promise<{ dayInMonth: number; weekday: string; times: Record<string, number> }[]> {
  console.info('Getting times for Kroloftet');

  const dom = await getDom(KROLOFTET_URL);

  await waitFor(() => dom.window.document.getElementsByClassName('upcoming-day-group').length > 0);

  const dayGroups = Array.from(dom.window.document.getElementsByClassName('upcoming-day-group')).map(dayGroupToDay);
  const days = R.compact(dayGroups);

  console.info(`Got times for Kroloftet (${days.length} days)`);
  return days;
}

function dayGroupToDay(
  dayGroup: Element,
): { dayInMonth: number; weekday: string; times: Record<string, number> } | null {
  const groupHeading = dayGroup.querySelector('.caption')?.textContent;

  if (groupHeading == null) {
    console.warn('Found a day group without a heading, skipping');
    return null;
  }

  const [dayInMonth, weekday] = groupHeading.split(' ');
  const times = R.pipe(dayGroup, getTimesFromDayGroup, (it) => R.merge(emptyDay, it));

  return {
    dayInMonth: parseInt(dayInMonth),
    weekday,
    times,
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
  return JSDOM.fromURL(url, {
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    resources: 'usable',
  });
}

// wait for predicate to be true (typescript)
async function waitFor<T>(predicate: () => T | undefined): Promise<T> {
  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      const result = predicate();
      if (result) {
        clearInterval(interval);
        resolve(result);
      }
    }, 100);
  });
}

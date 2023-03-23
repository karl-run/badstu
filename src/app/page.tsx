import { Inter } from 'next/font/google';

import { getTimes } from '@/scraping/obf';
import { cn } from '@/utils/cn';

const inter = Inter({ subsets: ['latin'] });

let cache: { dayInMonth: number; weekday: string; times: Record<string, number> }[] | null = null;

export const revalidate = 60;

export default async function Home() {
  /*
  let times: { dayInMonth: number; weekday: string; times: Record<string, number> }[];
  if (global.cache == null) {
    times = await getTimes();
    global.cache = times;
  } else {
    console.info('Using cached times');
    times = global.cache;
  }
  */

  const times = await getTimes();

  return (
    <main className={cn(inter.className, 'p-4 sm:p-16')}>
      <h1 className="mb-4 text-2xl font-bold">Hemmelig Kroloftet Booking Oversikt</h1>
      <div className="flex flex-wrap gap-4 ">
        {times.map((it) => (
          <div key={it.dayInMonth} className="min-w-[12rem] flex-grow bg-slate-100 p-4 sm:flex-grow-0">
            <h2 className="text-md font-bold">
              {it.dayInMonth}: {it.weekday}
            </h2>
            <ul className="flex flex-col gap-2">
              {Object.entries(it.times).map(([time, available]) => (
                <li
                  key={time}
                  className={cn('bg-slate-300 p-2', {
                    'bg-red-200': available === 0,
                    'bg-green-200': available > 0,
                  })}
                >
                  {time}: ({available})
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </main>
  );
}

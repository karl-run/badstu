import { Inter } from 'next/font/google';
import dynamic from 'next/dynamic';

import { getTimes } from '@/scraping/obf';
import { cn } from '@/utils/cn';

const LastUpdated = dynamic(() => import('@/components/LastUpdated'), {
  ssr: false,
  loading: () => <p>Klokkeslettene</p>,
});

const inter = Inter({ subsets: ['latin'] });

export const revalidate = 60;

export default async function Home() {
  let times: { dayInMonth: number; weekday: string; times: Record<string, number> }[];
  if (process.env.NODE_ENV === 'development') {
    if ((global as any).cache == null) {
      times = await getTimes();
      (global as any).cache = times;
    } else {
      console.info('Using cached times');
      times = (global as any).cache;
    }
  } else {
    times = await getTimes();
  }

  return (
    <main className={cn(inter.className, 'p-4 sm:p-16')}>
      <div className="mb-4 flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-2xl font-bold">Hemmelig Kroloftet Booking Oversikt</h1>
        <LastUpdated generatedAt={new Date().toISOString()} />
      </div>
      <div className="flex flex-wrap justify-between gap-4">
        {times.map((it) => (
          <div key={it.dayInMonth} className="min-w-[12rem] flex-grow bg-slate-100 p-4">
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

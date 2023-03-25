import { Inter } from 'next/font/google';
import dynamic from 'next/dynamic';
import { format } from 'date-fns';

import { getTimes } from '@/scraping/obf';
import { cn } from '@/utils/cn';
import { nb } from 'date-fns/locale';
import { createClickableBookingLink } from '@/utils/planyo-utils';

const LastUpdated = dynamic(() => import('@/components/LastUpdated'), {
  ssr: false,
  loading: () => <p>Klokkeslettene</p>,
});

const inter = Inter({ subsets: ['latin'] });

export const revalidate = 60;

export default async function Home() {
  const times = await getTimes();

  return (
    <main className={cn(inter.className, 'p-4 sm:p-16')}>
      <div className="mb-4 flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-2xl font-bold">Hemmelig Kroloftet Booking Oversikt</h1>
        <LastUpdated generatedAt={new Date().toISOString()} />
      </div>
      <div className="flex flex-wrap justify-between gap-4">
        {times.map(([date, times]) => (
          <div key={date} className="min-w-[12rem] flex-grow bg-slate-50 rounded">
            <h2 className="text-md mx-4 my-2 font-bold">{format(new Date(date), 'do LLLL (EEEE)', { locale: nb })}</h2>
            <ul className="grid grid-cols-1 divide-y">
              {Object.entries(times).map(([time, available]) => (
                <li
                  key={time}
                  className={cn('', {
                    'bg-green-200': available > 0,
                  })}
                >
                  {available > 0 ? (
                    <a
                      href={createClickableBookingLink(date, time)}
                      className="relative block flex h-full w-full justify-between p-2 px-4"
                    >
                      <span>
                        {time}: ({available})
                      </span>
                      <span className="absolute px-4 right-2 top-0 text-3xl">›</span>
                    </a>
                  ) : (
                    <div className="px-4 py-2">
                      {time}: ({available})
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </main>
  );
}

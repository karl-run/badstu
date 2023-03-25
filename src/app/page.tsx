import { Inter } from 'next/font/google';
import dynamic from 'next/dynamic';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import Image from 'next/image';

import { getTimes } from '@/scraping/obf';
import { cn } from '@/utils/cn';
import { createClickableBookingLink } from '@/utils/planyo-utils';
import HouseIcon from '@/components/HouseIcon';

const LastUpdated = dynamic(() => import('@/components/LastUpdated'), {
  ssr: false,
  loading: () => <p>Klokkeslettene</p>,
});

const inter = Inter({ subsets: ['latin'] });

export const revalidate = 60;

export default async function Home() {
  const times = await getTimes();

  return (
    <main className={cn(inter.className, 'container mx-auto p-4 sm:p-16')}>
      <div className="mb-4 flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-2xl font-bold">Hemmelig Kroloftet Booking Oversikt</h1>
        <LastUpdated generatedAt={new Date().toISOString()} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {times.map(([date, times]) => (
          <div key={date} className="highlight-white/5 rounded-lg bg-slate-800/70 shadow-highlight-white">
            <h2 className="text-md mx-4 my-2 font-bold">{format(new Date(date), 'do LLLL (EEEE)', { locale: nb })}</h2>
            <ul className="grid grid-cols-1 divide-y">
              {Object.entries(times).map(([time, { available, isFullyBookable }]) => (
                <li
                  key={time}
                  className={cn('', {
                    'bg-emerald-600/20 hover:bg-emerald-600/50': available > 0,
                    'bg-yellow-600/20': isFullyBookable,
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
                      <span className="absolute right-2 top-0 px-4 text-3xl">›</span>
                    </a>
                  ) : (
                    <div
                      className="flex items-center justify-between px-4 py-2"
                      title={isFullyBookable ? 'Denne badstuen kan fortsatt bookes privat' : undefined}
                    >
                      {time}: ({available}){isFullyBookable && <HouseIcon />}
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

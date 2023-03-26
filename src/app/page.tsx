import { Inter } from 'next/font/google';
import dynamic from 'next/dynamic';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';

import { getTimes } from '@/scraping/obf';
import { cn } from '@/utils/cn';
import { createClickableBookingLink } from '@/utils/planyo-utils';
import HouseIcon from '@/components/HouseIcon';
import Time from '@/components/Time';
import CrossIcon from '@/components/CrossIcon';

const LastUpdated = dynamic(() => import('@/components/LastUpdated'), {
  ssr: false,
  loading: () => <p>Klokkeslettene</p>,
});

const inter = Inter({ subsets: ['latin'] });

export const revalidate = 30;

export default async function Home() {
  const times = await getTimes();

  return (
    <main className={cn(inter.className, 'container mx-auto p-4 sm:p-16')}>
      <div className="mb-4 flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-2xl font-bold">Kroloftet Drop-in</h1>
        <LastUpdated generatedAt={new Date().toISOString()} />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {times.map(([date, times]) => {
          const timesList = Object.entries(times);
          const anythingAvailable = timesList.some(
            ([, { available, isFullyBookable }]) => isFullyBookable || available > 0,
          );

          return (
            <div
              key={date}
              className={cn(
                'dark:highlight-white rounded-lg border dark:border-none dark:bg-slate-800/70 dark:shadow-highlight-white',
              )}
            >
              <h2 className="text-md mx-4 my-2 flex justify-between font-bold">
                <span>{format(new Date(date), 'do LLLL (EEEE)', { locale: nb })}</span>
                {!anythingAvailable && <span className="md:hidden">Ingenting ledig</span>}
              </h2>
              <ul className="grid grid-cols-1 divide-y">
                {timesList.map(([time, { available, isFullyBookable }]) => (
                  <li
                    key={time}
                    className={cn('', {
                      'bg-emerald-600/20 hover:bg-emerald-600/50': available > 0,
                    })}
                  >
                    {available > 0 ? (
                      <a
                        href={createClickableBookingLink(date, time)}
                        className="relative block flex h-full w-full justify-between p-2 px-4"
                      >
                        <span className="flex">
                          <Time>{time}</Time>
                          <div>{available} ledige</div>
                        </span>
                        <span className="absolute right-2 top-0 px-4 text-3xl">›</span>
                      </a>
                    ) : (
                      <div
                        className="flex items-center justify-between px-4 py-2"
                        title={isFullyBookable ? 'Denne badstuen kan fortsatt bookes privat' : undefined}
                      >
                        <div className="flex items-center">
                          <Time>{time}</Time>
                          {isFullyBookable ? (
                            <div className="text-sm">Åpen for privat booking</div>
                          ) : (
                            <div className="flex items-center">{available || <CrossIcon />}</div>
                          )}
                        </div>
                        {isFullyBookable && <HouseIcon />}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </main>
  );
}

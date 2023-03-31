import { format } from 'date-fns';
import { nb } from 'date-fns/locale';

import { Availability, AvailabilityResult } from '@/scraping/types';
import { cn } from '@/utils/cn';
import { createClickableBookingLink } from '@/utils/planyo-utils';
import Time from '@/components/Time';
import CrossIcon from '@/components/CrossIcon';
import HouseIcon from '@/components/HouseIcon';

export const BadstuDay = ({ date, times }: { date: string; times: AvailabilityResult }) => {
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
        {timesList.map(([time, availability]) => (
          <BookingListItem key={time} availability={availability} date={date} time={time} />
        ))}
      </ul>
    </div>
  );
};

interface BookingListItemProps {
  time: string;
  availability: Availability;
  date: string;
}

function BookingListItem({
  time,
  date,
  availability: { available, isFullyBookable },
}: BookingListItemProps) {
  const hasAvailableSlots = available > 0;
  return (
    <li
      className={cn({
        'bg-emerald-600/20 hover:bg-emerald-600/50': hasAvailableSlots,
      })}
    >
      {hasAvailableSlots ? (
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
  );
}

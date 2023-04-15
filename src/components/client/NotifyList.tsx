'use client';

import * as R from 'remeda';
import React from 'react';
import {
  Popover,
  PopoverArrow,
  PopoverDisclosure,
  PopoverHeading,
  usePopoverStore,
} from '@ariakit/react';
import { parseISO } from 'date-fns';
import Link from 'next/link';

import { NotifyClean } from '@/utils/notify.ts/types';
import { toReadableDateWithWeekdayName } from '@/utils/date';

interface Props {
  todays: NotifyClean[];
  notifies: NotifyClean[];
}

function NotifyList({ todays, notifies }: Props): JSX.Element {
  const popover = usePopoverStore();
  const grouped = R.groupBy(notifies, R.prop('location'));
  const todayGrouped = R.groupBy(todays, R.prop('location'));

  return (
    <>
      <PopoverDisclosure
        store={popover}
        className="rounded border p-2 hover:bg-slate-100 dark:hover:bg-slate-800/70"
      >
        {todays.length === 0 ? (
          'Ingen varslinger'
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-full border border-red-300 bg-red-600 text-xs text-white">
              <span className="mono inline-block">{todays.length}</span>
            </div>
            <div>varsler i dag</div>
          </div>
        )}
      </PopoverDisclosure>
      <Popover
        store={popover}
        className="m-8 mt-0 max-w-xs rounded border bg-white p-4 pt-3 dark:bg-slate-800"
      >
        <PopoverArrow />
        <PopoverHeading className="text-lg font-bold">Meldinger sendt i dag</PopoverHeading>
        <div className="mb-4">
          {todays.length === 0 ? (
            <div>Ingen varslinger i dag</div>
          ) : (
            <Groups groups={todayGrouped} closePopover={popover.hide} />
          )}
        </div>
        <PopoverHeading className="text-lg font-bold">Alle aktive varsler</PopoverHeading>
        <Groups groups={grouped} closePopover={popover.hide} />
      </Popover>
    </>
  );
}

function Groups({
  groups,
  closePopover,
}: {
  groups: Record<string, NotifyClean[]>;
  closePopover: () => void;
}) {
  return (
    <div>
      {R.toPairs(groups).map(([location, notifies]) => (
        <div key={location}>
          <div className="font-bold uppercase">{location}</div>
          <div key={location} className="flex flex-col">
            {notifies.map((notify) => (
              <div key={`${notify.date}-${notify.slot}`} className="flex justify-between">
                <Link
                  href={`${location}?scrollTo=${notify.date}`}
                  className="underline"
                  onClick={closePopover}
                >
                  {toReadableDateWithWeekdayName(parseISO(notify.date))}
                </Link>
                <div>{notify.slot}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default NotifyList;

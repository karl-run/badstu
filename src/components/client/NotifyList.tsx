'use client';

import * as R from 'remeda';
import React from 'react';
import {
  Popover,
  PopoverArrow,
  PopoverDescription,
  PopoverDisclosure,
  PopoverHeading,
  usePopoverStore,
} from '@ariakit/react';
import { parseISO } from 'date-fns';
import Link from 'next/link';

import { NotifyClean } from '@/utils/notify.ts/types';

interface Props {
  notifies: NotifyClean[];
}

function NotifyList({ notifies }: Props): JSX.Element {
  const popover = usePopoverStore();
  const grouped = R.groupBy(notifies, R.prop('location'));

  return (
    <>
      <PopoverDisclosure
        store={popover}
        className="rounded border p-2 hover:bg-slate-100 dark:hover:bg-slate-800/70"
      >
        {notifies.length} aktive varsler
      </PopoverDisclosure>
      <Popover
        store={popover}
        className="m-8 mt-0 max-w-xs rounded border bg-white p-4 pt-3 dark:bg-slate-800"
      >
        <PopoverArrow />
        <PopoverHeading className="text-lg font-bold">Dine aktive varsler</PopoverHeading>
        <PopoverDescription>
          {R.toPairs(grouped).map(([location, notifies]) => (
            <div key={location}>
              <div className="font-bold">{location}</div>
              <div key={location} className="flex flex-col">
                {notifies.map((notify) => (
                  <div key={`${notify.date}-${notify.slot}`} className="flex justify-between">
                    <Link href={`${location}?scrollTo=${notify.date}`} className="underline">
                      {parseISO(notify.date).toLocaleDateString()}
                    </Link>
                    <div>{notify.slot}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </PopoverDescription>
      </Popover>
    </>
  );
}

export default NotifyList;

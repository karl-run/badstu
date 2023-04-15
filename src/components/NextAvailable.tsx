'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { formatDistanceToNowStrict, isToday, parseISO } from 'date-fns';
import { nb } from 'date-fns/locale';
import Link from 'next/link';

import { Location, locationToTitle } from '@/scraping/metadata';

function NextAvailable(): JSX.Element {
  const [show, setShow] = useState(false);

  return (
    <div className="mb-4 flex h-10 items-center sm:justify-end">
      {!show && (
        <button
          className="flex w-full items-center justify-center gap-4 rounded-lg border p-2 text-xs hover:bg-slate-100 dark:hover:bg-slate-800/70 sm:w-auto"
          onClick={() => setShow((b) => !b)}
        >
          Lurer du på hva neste ledige time er?
        </button>
      )}
      {show && <NextSlot />}
    </div>
  );
}

function NextSlot() {
  const result = useSWR('next-slot', () => fetchNextSlot());

  if (result.isLoading) {
    return (
      <div
        className="h-full w-full animate-pulse rounded-full bg-gray-200 dark:bg-gray-700 sm:w-64"
        aria-label="Laster neste tidspunkt"
        aria-live="polite"
      />
    );
  }

  if (!result.data) {
    return <div className="text-sm">Klarte ikke å hente neste ledige tidspunkt :(</div>;
  }

  const [where, when, slot, available] = result.data;
  const whenDate = parseISO(when);

  return (
    <div className="text-sm">
      <span>Neste ledige tidspunkt er på </span>
      <Link href={`${where}?scrollTo=${when}`} scroll className="underline">
        {locationToTitle(where)}
      </Link>{' '}
      <NextSlotSpan whenDate={whenDate} /> kl. <span className="font-bold">{slot}</span>. Det er{' '}
      <span className="font-bold">{available}</span> ledige plasser.
    </div>
  );
}

const NextSlotSpan = ({ whenDate }: { whenDate: Date }): JSX.Element =>
  isToday(whenDate) ? (
    <span className="font-bold">i dag</span>
  ) : (
    <span>
      om{' '}
      {
        <span className="font-bold">
          {formatDistanceToNowStrict(whenDate, {
            locale: nb,
            unit: 'day',
            roundingMethod: 'ceil',
          })}
        </span>
      }
    </span>
  );

async function fetchNextSlot(): Promise<
  [where: Location, when: string, slot: string, available: number]
> {
  return fetch('/next-available', { method: 'GET' }).then((res) => res.json());
}

export default NextAvailable;

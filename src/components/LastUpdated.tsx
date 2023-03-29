'use client';

import React, { useEffect } from 'react';
import * as E from 'fp-ts/Either';
import { parseISO, differenceInSeconds, formatDistanceStrict } from 'date-fns';
import { nb } from 'date-fns/locale';
import { useRouter } from 'next/navigation';

import { useRerender } from '@/hooks/useRerender';
import { triggerScrape } from '@/data/fetching';

interface Props {
  generatedAt: string;
}

function useScrapeEvery15thSeconds(now: Date, generatedAtDate: Date) {
  const router = useRouter();
  const secondsSince = differenceInSeconds(now, generatedAtDate);

  useEffect(() => {
    if ((secondsSince + 1) % 15 !== 0) return;

    triggerScrape().then((result) => {
      if (E.isRight(result)) {
        router.refresh();
      }
    });
  }, [router, secondsSince]);

  return secondsSince;
}

function useScrapeOnMount() {
  const router = useRouter();

  useEffect(() => {
    triggerScrape().then((result) => {
      if (E.isRight(result)) {
        router.refresh();
      }
    });
  }, [router]);
}

function LastUpdated({ generatedAt }: Props): JSX.Element | null {
  useScrapeOnMount();
  useRerender(1);

  const now = new Date();
  const generatedAtDate = parseISO(generatedAt);
  const distance = formatDistanceStrict(generatedAtDate, now, { locale: nb });

  const secondsSince = useScrapeEvery15thSeconds(now, generatedAtDate);

  if (secondsSince < 2) {
    return <p>Klokkeslettene er ferske</p>;
  }

  return <p>Klokkeslettene er {distance} gamle</p>;
}

export default LastUpdated;

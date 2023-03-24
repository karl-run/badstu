'use client';

import React, { useEffect } from 'react';
import { parseISO, differenceInSeconds, formatDistanceStrict } from 'date-fns';
import { nb } from 'date-fns/locale';
import { useRouter } from 'next/navigation';

import { useRerender } from '@/hooks/useRerender';

interface Props {
  generatedAt: string;
}

function LastUpdated({ generatedAt }: Props): JSX.Element | null {
  const router = useRouter();

  useRerender(1);
  const now = new Date();
  const generatedAtDate = parseISO(generatedAt);
  const secondsSince = differenceInSeconds(now, generatedAtDate);
  const distance = formatDistanceStrict(generatedAtDate, now, { unit: 'second', locale: nb });

  useEffect(() => {
    if ((secondsSince + 1) % 60 === 0) {
      router.refresh();
    }
  }, [router, secondsSince]);

  if (secondsSince < 2) {
    return <p>Klokkeslettene er ferske</p>;
  }

  return <p>Klokkeslettene er {distance} gamle</p>;
}

export default LastUpdated;

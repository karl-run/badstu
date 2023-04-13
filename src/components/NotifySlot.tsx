'use client';

import React, { startTransition } from 'react';
import { useRouter } from 'next/navigation';

import Checkbox from '@/components/Checkbox';
import { Location } from '@/scraping/metadata';

interface Props {
  location: Location;
  slot: string;
  date: string;
  className: string;
  hasNotify: boolean;
}

function NotifySlot({ location, slot, date, hasNotify }: Props): JSX.Element {
  const router = useRouter();
  const toggle = async (checked: boolean): Promise<boolean> => {
    const response = await fetch(`/${location}/notify`, {
      method: 'PUT',
      body: JSON.stringify({
        slot,
        date,
        add: checked,
      }),
    });

    if (response.ok) {
      startTransition(() => {
        router.refresh();
      });
    }

    return response.ok;
  };

  return <Checkbox id={`${date}-${slot}`} defaultChecked={hasNotify} onToggle={toggle} />;
}

export default NotifySlot;

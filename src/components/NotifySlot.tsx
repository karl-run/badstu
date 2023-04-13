'use client';

import React from 'react';

import Checkbox from '@/components/Checkbox';

interface Props {
  slot: string;
  date: string;
  className: string;
}

function NotifySlot({ slot, date, className }: Props): JSX.Element {
  const toggle = async (): Promise<boolean> => {
    const response = await fetch('/api/notify', {
      method: 'PUT',
      body: JSON.stringify({
        slot,
        date,
      }),
    });

    return response.ok;
  };

  return <Checkbox id={`${date}-${slot}`} onToggle={toggle} />;
}

export default NotifySlot;

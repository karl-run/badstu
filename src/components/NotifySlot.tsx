'use client';

import React, { ReactElement } from 'react';

import Checkbox from '@/components/Checkbox';
import { Location } from '@/scraping/metadata';
import { toggleNotifySlot } from '@/components/NotifySlotActions';

interface Props {
  location: Location;
  slot: string;
  date: string;
  className: string;
  hasNotify: boolean;
}

function NotifySlot({ location, slot, date, hasNotify }: Props): ReactElement {
  const toggle = async (checked: boolean): Promise<boolean> => {
    const result = await toggleNotifySlot({ location, slot, date, add: checked });

    console.info('NotifySlot', { location, slot, date, hasNotify }, result);

    return true;
  };

  return <Checkbox id={`${date}-${slot}`} defaultChecked={hasNotify} onToggle={toggle} />;
}

export default NotifySlot;

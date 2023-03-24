'use client';

import React from 'react';
import usePWAInstall from 'use-pwa-install';

import { cn } from '@/utils/cn';

function EnableNotificationsButton(): JSX.Element {
  const { isInstalled, install } = usePWAInstall();

  return (
    <>
      <button
        className={cn('rounded bg-blue-100 p-2', {
          'bg-green-100': Notification.permission === 'granted',
        })}
        onClick={() => {
          Notification.requestPermission().then((permission) => {
            console.log(permission);
          });
        }}
      >
        {Notification.permission === 'granted' ? 'Notifications enabled' : 'Enable notifications'}
      </button>
      {!isInstalled && <button onClick={install}>Install</button>}
    </>
  );
}

export default EnableNotificationsButton;

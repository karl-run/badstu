'use client';

import { Tooltip, TooltipAnchor, useTooltipStore } from '@ariakit/react';

import WarningIcon from '@/components/icons/WarningIcon';

export function MissingPhoneWarning() {
  const store = useTooltipStore({ gutter: 16 });
  return (
    <div>
      <TooltipAnchor store={store}>
        <WarningIcon className="mr-2 text-yellow-500" />
      </TooltipAnchor>
      <Tooltip store={store} className="rounded border bg-white p-4 dark:bg-slate-800 sm:w-48">
        Du har ikke satt opp et gyldig telefonnummer. Du vil ikke kunne motta varsler før du gjør
        det.
      </Tooltip>
    </div>
  );
}

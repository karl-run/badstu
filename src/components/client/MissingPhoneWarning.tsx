'use client';

import { Tooltip, TooltipAnchor, useTooltipStore } from '@ariakit/react';

import WarningIcon from '@/components/icons/WarningIcon';

export function MissingPhoneWarning() {
  const store = useTooltipStore({ gutter: 8 });
  return (
    <div>
      <TooltipAnchor store={store}>
        <WarningIcon className="mr-2 text-yellow-500" />
      </TooltipAnchor>
      <Tooltip store={store} className="rounded border bg-slate-800 p-4 sm:w-48">
        Du har ikke satt opp et gyldig telefonnummer. Du vil ikke kunne motta varsler før du gjør
        det.
      </Tooltip>
    </div>
  );
}

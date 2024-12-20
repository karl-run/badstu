import React, { ReactElement } from 'react';

interface Props {
  id: string;
  defaultChecked: boolean;
  onToggle: (checked: boolean) => Promise<boolean>;
}

function Checkbox({ id, defaultChecked, onToggle }: Props): ReactElement {
  return (
    <div className="relative flex h-full w-10 shrink-0 items-center justify-center border-r">
      <input
        id={id}
        type="checkbox"
        defaultChecked={defaultChecked}
        onChange={async (event) => {
          const returnToIfFailed = !event.target.checked;
          const toggleResult: boolean = await onToggle(event.target.checked);

          if (!toggleResult) {
            event.target.checked = returnToIfFailed;
          }
        }}
        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
      />
      <label htmlFor={id} className="absolute left-0 top-0 h-full w-10" />
    </div>
  );
}

export default Checkbox;

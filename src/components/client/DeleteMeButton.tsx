'use client';

import { useState, ReactElement } from 'react';
import {
  Button,
  Popover,
  PopoverArrow,
  PopoverDescription,
  PopoverDisclosure,
  PopoverHeading,
  usePopoverStore,
} from '@ariakit/react';
import { signOut } from 'next-auth/react';

function DeleteMeButton({ userId }: { userId: string }): ReactElement {
  const popover = usePopoverStore();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingError, setDeletingError] = useState<string | null>(null);

  const handleDelete = async () => {
    popover.hide();
    setDeletingError(null);
    setIsDeleting(true);
    const response = await fetch('/profile/delete-me', {
      method: 'POST',
      body: JSON.stringify({ user: userId }),
    });

    if (response.ok) {
      await signOut({
        redirect: true,
        callbackUrl: '/',
      });
    } else {
      setDeletingError('Klarte ikke å slette deg, men prøv igjen senere!');
    }

    setIsDeleting(false);
  };

  return (
    <>
      <PopoverDisclosure
        store={popover}
        className="mt-2 rounded bg-red-300 p-2 dark:bg-red-800 dark:text-white"
      >
        Slett all data om meg
      </PopoverDisclosure>
      {isDeleting && <p>Vent mens du slettes...</p>}
      {deletingError && (
        <p className="my-4 max-w-prose rounded border bg-red-50 p-2">{deletingError}</p>
      )}
      <Popover
        store={popover}
        className="m-8 mt-0 max-w-xs rounded border bg-white p-4 pt-3 dark:bg-slate-800"
      >
        <PopoverArrow className="arrow" />
        <PopoverHeading className="text-lg font-bold">
          Er du sikker på at all data om deg skal slettes?
        </PopoverHeading>
        <PopoverDescription>
          Dette kan ikke angres. Du vil ikke lenger motta varslinger om ledige plasser.
        </PopoverDescription>
        <Button
          className="mt-2 rounded bg-red-600 p-2 text-white"
          disabled={isDeleting}
          onClick={handleDelete}
        >
          Ja, jeg er sikker
        </Button>
      </Popover>
    </>
  );
}

export default DeleteMeButton;

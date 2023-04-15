'use client';

import Image from 'next/image';
import {
  Menu,
  MenuButton,
  MenuButtonArrow,
  MenuDescription,
  MenuHeading,
  MenuItem,
  MenuSeparator,
  useMenuStore,
} from '@ariakit/react';
import { DefaultSession } from 'next-auth';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

import { MissingPhoneWarning } from '@/components/client/MissingPhoneWarning';
import WarningIcon from '@/components/icons/WarningIcon';

interface Props {
  user: DefaultSession['user'];
  userHasNumber: boolean;
}

export default function UserMenu({ user, userHasNumber }: Props) {
  const menu = useMenuStore({ gutter: 8, placement: 'bottom-end' });

  console.log({ userHasNumber });
  return (
    <>
      <MenuButton store={menu} className="flex items-center border-l pl-4">
        {!userHasNumber && <MissingPhoneWarning />}
        <div>{user?.name ?? 'Ukjent navn'}</div>
        {user?.image && (
          <Image width="28" height="28" className="ml-4 h-6 w-6" src={user.image} alt="" />
        )}
        <MenuButtonArrow />
      </MenuButton>
      <Menu store={menu} className="rounded border bg-white dark:bg-slate-900">
        <MenuHeading className="menu-heading p-2 pb-0">{user?.name ?? 'Ukjent bruker'}</MenuHeading>
        <MenuDescription className="px-2 text-xs">{user?.email}</MenuDescription>
        {!userHasNumber && (
          <MenuItem
            as={Link}
            href="/profile"
            className="m-2 flex cursor-pointer items-center justify-center border p-2 px-2 text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <WarningIcon size={16} className="mr-2 text-yellow-500" />
            <p>Mangler telefonnummer</p>
          </MenuItem>
        )}
        <MenuSeparator className="mt-2" />
        <MenuItem
          className="block cursor-pointer p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
          as={Link}
          href="/profile"
        >
          Min profil
        </MenuItem>
        <MenuItem
          className="cursor-pointer p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
          onClick={() => signOut()}
        >
          Logg ut
        </MenuItem>
      </Menu>
    </>
  );
}

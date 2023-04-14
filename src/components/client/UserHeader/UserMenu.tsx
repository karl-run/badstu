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
import { DefaultSession } from 'next-auth/src/core/types';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

interface Props {
  user: DefaultSession['user'];
}

export default function UserMenu({ user }: Props) {
  const menu = useMenuStore({ gutter: 8 });
  return (
    <>
      <MenuButton store={menu} className="flex items-center border-l pl-4">
        <div>{user?.name ?? 'Ukjent navn'}</div>
        {user?.image && (
          <Image width="28" height="28" className="ml-4 h-6 w-6" src={user.image} alt="" />
        )}
        <MenuButtonArrow />
      </MenuButton>
      <Menu store={menu} className="rounded border bg-white dark:bg-slate-900">
        <MenuHeading className="menu-heading p-2 pb-0">{user?.name ?? 'Ukjent bruker'}</MenuHeading>
        <MenuDescription className="p-2 pt-0 text-xs">{user?.email}</MenuDescription>
        <MenuSeparator className="separator" />
        <MenuItem className="cursor-pointer p-2 dark:hover:bg-slate-800 hover:bg-slate-100 block" as={Link} href="/profile">
          Min profil
        </MenuItem>
        <MenuItem className="cursor-pointer p-2 dark:hover:bg-slate-800 hover:bg-slate-100" onClick={() => signOut()}>
          Logg ut
        </MenuItem>
      </Menu>
    </>
  );
}

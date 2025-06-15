'use client'

import Image from 'next/image'
import {
  Menu,
  MenuButton,
  MenuButtonArrow,
  MenuDescription,
  MenuHeading,
  MenuItem,
  MenuSeparator,
  useMenuStore,
} from '@ariakit/react'
import { DefaultSession } from 'next-auth'
import { signOut } from 'next-auth/react'
import Link from 'next/link'

interface Props {
  user: DefaultSession['user']
}

export default function UserMenu({ user }: Props) {
  const menu = useMenuStore({ placement: 'bottom-end' })

  return (
    <>
      <MenuButton
        store={menu}
        className="flex items-center rounded border p-2 hover:bg-slate-100 dark:hover:bg-slate-800/70"
      >
        <div>{user?.name ?? 'Ukjent navn'}</div>
        {user?.image && <Image width="28" height="28" className="mx-2 h-6 w-6" src={user.image} alt="" />}
        <MenuButtonArrow />
      </MenuButton>
      <Menu store={menu} gutter={8} className="rounded border bg-white dark:bg-slate-900">
        <MenuHeading className="menu-heading p-2 pb-0">{user?.name ?? 'Ukjent bruker'}</MenuHeading>
        <MenuDescription className="px-2 text-xs">{user?.email}</MenuDescription>
        <MenuSeparator className="mt-2" />
        <MenuItem
          className="block cursor-pointer p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
          render={<Link href="/profile" />}
        >
          Min profil
        </MenuItem>
        {(user as any).isAdmin && (
          <MenuItem
            className="block cursor-pointer p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
            render={<Link href="/admin" />}
          >
            Admin
          </MenuItem>
        )}
        <MenuItem className="cursor-pointer p-2 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => signOut()}>
          Logg ut
        </MenuItem>
      </Menu>
    </>
  )
}

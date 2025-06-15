'use client'

import { useSession, signIn } from 'next-auth/react'
import { ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import UserMenu from './UserMenu'

interface Props {
  notifies: ReactNode
}

function UserHeader({ notifies }: Props) {
  return (
    <div className="flex items-center justify-between">
      <Link href="/">
        <Image src="/logo.png" alt="" height={32} width={32} className="ml-4 hidden h-8 w-8 shrink-0 sm:block" />
      </Link>
      <div className="flex items-center justify-end p-4">
        {notifies}
        <LoginButton />
      </div>
    </div>
  )
}

function LoginButton() {
  const { data: session } = useSession()

  return session?.user ? (
    <UserMenu user={session.user} />
  ) : (
    <button onClick={() => signIn('google')}>Logg inn for varsler</button>
  )
}

export default UserHeader

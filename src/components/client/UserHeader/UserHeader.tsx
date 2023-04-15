'use client';

import { useSession, signIn } from 'next-auth/react';
import { ReactNode } from 'react';
import Image from 'next/image';
import Link from "next/link";

import UserMenu from './UserMenu';

interface Props {
  notifies: ReactNode;
  userHasNumber: boolean;
}

function UserHeader({ userHasNumber, notifies }: Props) {
  return (
    <div className="flex items-center justify-between">
      <Link href="/">
        <Image src="/logo.png" alt="" height={32} width={32} className="mx-4 h-8 w-8 shrink-0" />
      </Link>
      <div className="flex items-center justify-end p-4">
        {notifies}
        <LoginButton userHasNumber={userHasNumber} />
      </div>
    </div>
  );
}

function LoginButton({ userHasNumber }: Pick<Props, 'userHasNumber'>) {
  const { data: session } = useSession();

  return session?.user ? (
    <UserMenu user={session.user} userHasNumber={userHasNumber} />
  ) : (
    <button onClick={() => signIn()}>Logg inn for varsler</button>
  );
}

export default UserHeader;

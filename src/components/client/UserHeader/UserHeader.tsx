'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import Image from 'next/image';
import { ReactNode } from 'react';

import UserMenu from './UserMenu';

function UserHeader({ notifies }: { notifies: ReactNode }) {
  return (
    <div className="flex items-center justify-end p-4">
      {notifies}
      <LoginButton />
    </div>
  );
}

function LoginButton() {
  const { data: session } = useSession();

  return session?.user ? (
    <UserMenu user={session.user} />
  ) : (
    <button onClick={() => signIn()}>Logg inn for varsler</button>
  );
}

export default UserHeader;

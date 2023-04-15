'use client';

import { useSession, signIn } from 'next-auth/react';
import { ReactNode } from 'react';

import UserMenu from './UserMenu';

interface Props {
  notifies: ReactNode;
  userHasNumber: boolean;
}

function UserHeader({ userHasNumber, notifies }: Props) {
  return (
    <div className="flex items-center justify-end p-4">
      {notifies}
      <LoginButton userHasNumber={userHasNumber} />
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

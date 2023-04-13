'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import Image from 'next/image';

function UserHeader() {
  return (
    <div className="flex items-center justify-end p-4">
      <LoginButton />
    </div>
  );
}

function LoginButton() {
  const { data: session } = useSession();

  if (session?.user) {
    const user = session.user;
    return (
      <>
        <button className="ml-8 hover:underline" onClick={() => signOut()}>
          Logg ut ({user.name})
        </button>
        {user.image && (
          <Image width="28" height="28" className="ml-4 h-6 w-6" src={user.image} alt="" />
        )}
      </>
    );
  }
  return <button onClick={() => signIn()}>Logg inn for varsler</button>;
}

export default UserHeader;

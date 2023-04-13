'use client';

import { useSession, signIn, signOut } from 'next-auth/react';

function UserHeader() {
  return (
    <div className="flex items-center justify-end p-4">
      <LoginButton />
    </div>
  );
}

function LoginButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        Signed in as {session.user?.email} <br />
        <button onClick={() => signOut()}>Logg ut</button>
      </>
    );
  }
  return <button onClick={() => signIn()}>Logg inn for varsler</button>;
}

export default UserHeader;

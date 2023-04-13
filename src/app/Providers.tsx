'use client';

import React, { PropsWithChildren } from 'react';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';

function Providers({
  session,
  children,
}: PropsWithChildren<{ session: Session | null }>): JSX.Element {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}

export default Providers;

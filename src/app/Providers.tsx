'use client'

import React, { PropsWithChildren, ReactElement } from 'react'
import { SessionProvider } from 'next-auth/react'
import { Session } from 'next-auth'

function Providers({ session, children }: PropsWithChildren<{ session: Session | null }>): ReactElement {
  return <SessionProvider session={session}>{children}</SessionProvider>
}

export default Providers

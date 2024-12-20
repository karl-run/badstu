import React, { ReactElement } from 'react';
import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import Link from 'next/link';

import { authOptions } from '@/app/api/auth/[...nextauth]/_route';
import { getAdminStats } from '@/db/admin';
import Container from '@/components/common/Container';
import BackToRoot from '@/components/common/BackToRoot';

export const dynamic = 'force-dynamic';

async function Page(): Promise<ReactElement> {
  const session = await getServerSession(authOptions);
  if (session?.user?.email !== process.env.ADMIN_EMAIL) {
    notFound();
  }

  const [userCount, totalNotify, activeNotify, sentNotifications] = await getAdminStats();

  return (
    <Container>
      <BackToRoot />
      <h1 className="text-2xl font-bold">Secret admin stats</h1>
      <dl>
        <dt>Antall brukere</dt>
        <dd>{userCount}</dd>
        <dt>Antall aktive varsler</dt>
        <dd>{activeNotify}</dd>
        <dt>Antall varsler totalt</dt>
        <dd>{totalNotify}</dd>
        <dt>Antall varsler sendt</dt>
        <dd>{sentNotifications}</dd>
      </dl>
    </Container>
  );
}

export default Page;

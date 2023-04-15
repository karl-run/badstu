import React from 'react';
import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';

import { authOptions } from '@/app/api/auth/[...nextauth]/_route';
import { getAdminStats } from '@/db/admin';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function Page(): Promise<JSX.Element> {
  const session = await getServerSession(authOptions);
  if (session?.user?.email !== process.env.ADMIN_EMAIL) {
    notFound();
  }

  const [userCount, totalNotify, activeNotify, sentNotifications] = await getAdminStats();

  return (
    <main className="container mx-auto p-4 sm:p-16 sm:pt-2">
      <div className="mb-2 sm:-ml-3">
        <Link href="/">
          <span>‹</span> Tilbake til hovedsiden
        </Link>
      </div>
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
    </main>
  );
}

export default Page;

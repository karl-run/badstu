import './globals.css';

import { Analytics } from '@vercel/analytics/react';
import { PropsWithChildren } from 'react';
import { Inter } from 'next/font/google';
import { getServerSession } from 'next-auth';

import { cn } from '@/utils/cn';
import Providers from '@/app/Providers';
import UserHeader from '@/components/client/UserHeader/UserHeader';
import { authOptions } from '@/app/api/auth/[...nextauth]/_route';
import { getNotifies, getTodaysNotified, getUserPhoneNumber } from '@/db/user';
import { toCleanNotify } from '@/utils/notify';
import NotifyList from '@/components/client/NotifyList';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Badstu Booking Overview',
  description: 'Secret page, please ignore',
};

export default async function RootLayout({ children }: PropsWithChildren) {
  const session = await getServerSession(authOptions);
  const userHasNumber = session?.user?.email
    ? (await getUserPhoneNumber(session.user.email)) != null
    : false;

  return (
    <html
      lang="en"
      className={cn(
        inter.className,
        'bg-white text-slate-600 dark:bg-slate-900 dark:text-slate-400',
      )}
    >
      <body className="min-h-screen bg-fixed dark:bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))] dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
        <Providers session={session}>
          <UserHeader
            // @ts-expect-error Async RSC
            notifies={session?.user?.email && <NotifiesCount id={session.user.email} />}
            userHasNumber={userHasNumber}
          />
          {children}
        </Providers>
        <Analytics />
      </body>

    </html>
  );
}

async function NotifiesCount({ id }: { id: string }) {
  const notifies = (await getNotifies(id)).map(toCleanNotify);
  const todays = (await getTodaysNotified(id)).map(toCleanNotify);

  return (
    <div className="mr-4">
      <NotifyList todays={todays} notifies={notifies} />
    </div>
  );
}

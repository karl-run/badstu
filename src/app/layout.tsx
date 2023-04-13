import './globals.css';

import { Analytics } from '@vercel/analytics/react';
import { PropsWithChildren } from 'react';
import { Inter } from 'next/font/google';

import { cn } from '@/utils/cn';
import Providers from '@/app/Providers';
import UserHeader from '@/components/UserHeader/UserHeader';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Badstu Booking Overview',
  description: 'Secret page, please ignore',
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html
      lang="en"
      className={cn(
        inter.className,
        'bg-white text-slate-600 dark:bg-slate-900 dark:text-slate-400',
      )}
    >
      <body className="min-h-screen bg-fixed dark:bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))] dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
        <Providers session={null}>
          <UserHeader />
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}

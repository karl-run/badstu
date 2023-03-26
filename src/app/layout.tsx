import { PropsWithChildren } from 'react';
import './globals.css';

export const metadata = {
  title: 'Badstu Booking Overview',
  description: 'Secret page, please ignore',
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" className="bg-white text-slate-600 dark:bg-slate-900 dark:text-slate-400">
      <body className="h-screen bg-fixed dark:bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))] dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
        {children}
      </body>
    </html>
  );
}

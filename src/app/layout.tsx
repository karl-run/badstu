import { PropsWithChildren } from 'react';
import './globals.css';

export const metadata = {
  title: 'Badstu Booking Overview',
  description: 'Secret page, please ignore',
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" className="text-slate-400 bg-slate-900">
      <body>{children}</body>
    </html>
  );
}

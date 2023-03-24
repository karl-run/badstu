import { PropsWithChildren } from 'react';
import './globals.css';

export const metadata = {
  title: 'Badstu Booking Overview',
  description: 'Secret page, please ignore',
  manifest: '/manifest.json',
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

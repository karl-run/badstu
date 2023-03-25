import { PropsWithChildren } from 'react';
import './globals.css';

export const metadata = {
  title: 'Badstu Booking Overview',
  description: 'Secret page, please ignore',
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" className="bg-slate-900 text-slate-400">
      <body className=" bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))] from-slate-900 via-purple-900 to-slate-900 bg-fixed">
        {children}
      </body>
    </html>
  );
}

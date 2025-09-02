import './globals.css'

import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Image from 'next/image'

import logo from '../assets/logo.png'
import Link from 'next/link'
import HeadingWithBackArrow from '@/components/HeadingWithBackArrow'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Badstuer i Oslo',
  description: 'Se hvilke badstuer i Oslo har ledig drop-in i dag og fremover i tid!',
}

export default function RootLayout({ children }: Readonly<LayoutProps<'/'>>) {
  return (
    <html lang="no" className="bg-white text-slate-600 dark:bg-slate-900 dark:text-slate-400">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark:bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))] dark:from-slate-900 dark:via-purple-900 dark:to-slate-900`}
      >
        <header className="flex h-16 items-center justify-between border-b border-b-gray-300 bg-gray-100 dark:border-0 dark:bg-slate-900">
          <Link href="/" className="group flex items-center gap-4">
            <div className="ml-4 h-10 w-10 shrink-0">
              <Image src={logo} alt="" />
            </div>
            <HeadingWithBackArrow />
          </Link>
        </header>
        {children}
      </body>
    </html>
  )
}

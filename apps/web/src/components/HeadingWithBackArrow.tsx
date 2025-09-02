'use client'

import React, { ReactElement } from 'react'
import clsx from 'clsx'
import { ArrowLeft } from 'lucide-react'
import { usePathname } from 'next/navigation'

function HeadingWithBackArrow(): ReactElement {
  const pathname = usePathname()

  return (
    <h1 className="flex items-center gap-1 text-2xl text-gray-800 dark:text-gray-200">
      <ArrowLeft className={clsx('transition-all group-hover:-translate-x-1', { 'w-0': pathname === '/' })} />
      <span>Badstu i Oslo</span>
    </h1>
  )
}

export default HeadingWithBackArrow

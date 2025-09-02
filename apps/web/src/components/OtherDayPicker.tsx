'use client'

import { useEffect } from 'react'
import * as R from 'remeda'
import { addDays, formatISO } from 'date-fns'
import Link from 'next/link'
import { toReadableDateWithWeekdayName } from '@/utils/date'

type Props = {
  activeDate?: string
  from?: number
}

export default function OtherDayPicker({ activeDate, from = 1 }: Props) {
  const today = new Date()
  const next21Days = R.range(from, 21).map((offset) => formatISO(addDays(today, offset), { representation: 'date' }))

  useEffect(() => {
    if (!activeDate) return

    const activeNode = document.getElementById(`date-${activeDate}`)
    if (activeNode) {
      activeNode.scrollIntoView({ behavior: 'smooth', inline: 'center' })
    }
  }, [activeDate])

  return (
    <div className="relative flex h-full overflow-hidden">
      <div className="pointer-events-none absolute right-0 bottom-0 h-full w-4 shrink-0 bg-gradient-to-r from-transparent to-white dark:to-slate-900" />
      <div className="flex h-full gap-1 overflow-auto px-4 py-2">
        {next21Days.map((dateString) => (
          <Link
            key={dateString}
            id={`date-${dateString}`}
            href={`/dag/${dateString}`}
            className={[
              'flex h-full shrink-0 items-center rounded-md px-2 text-sm hover:bg-gray-200 hover:dark:bg-blue-800',
              dateString === activeDate
                ? 'border border-dashed border-blue-600 bg-blue-200 dark:border-slate-700 dark:bg-blue-950 dark:text-white'
                : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {toReadableDateWithWeekdayName(dateString)}
          </Link>
        ))}
      </div>
      <div className="pointer-events-none absolute bottom-0 left-0 h-full w-4 shrink-0 bg-gradient-to-l from-transparent to-white dark:to-slate-900" />
    </div>
  )
}

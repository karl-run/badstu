import { getLink } from '@badstu/data/meta'
import { ArrowRight } from 'lucide-react'
import { addMinutes, isAfter } from 'date-fns'
import { dateAndTimeToDate } from '@/utils/date'
import type { BadstuAvailability } from '@badstu/db/slots'
import Link from 'next/link'

interface RowLinkProps {
  location: { provider: 'obf'; date: string; variations: number }
  slot: BadstuAvailability['slots'][number]
}

export default function RowLink({ location, slot }: RowLinkProps) {
  const isTooLate = isAfter(new Date(), addMinutes(dateAndTimeToDate(location.date, slot.time), 60))

  return (
    <Link
      className={[
        'group flex h-14 justify-between transition-colors hover:bg-gray-400 dark:hover:bg-blue-950',
        isTooLate && 'opacity-50',
      ]
        .filter(Boolean)
        .join(' ')}
      href={getLink(location.provider, slot.variation.key, location.date)}
    >
      <div className="flex size-14 flex-col items-center justify-center">
        <div className="-mt-1 -mb-1.5 text-xl">{slot.available}</div>
        <div className="text-xs">av {slot.size}</div>
      </div>
      <div className="flex grow flex-col justify-center">
        <div className="leading-4">
          {slot.time} til {slot.timeEnd} ({slot.length}t)
        </div>
        {location.variations > 1 && slot.variation ? (
          <div className="text-xs">{slot.variation.text}</div>
        ) : (
          <div className="text-xs">Fellesbadstue</div>
        )}
      </div>
      <div className="mr-2 flex flex-col items-center justify-center">
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
      </div>
    </Link>
  )
}

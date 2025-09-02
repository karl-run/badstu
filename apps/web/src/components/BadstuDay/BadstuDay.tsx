import { ArrowRight, CircleDashed, LocateFixed } from 'lucide-react'
import type { AllLocationNames } from '@badstu/data/meta'
import type { BadstuAvailability } from '@badstu/db/slots'
import CoverHeader from './CoverHeader'
import SimpleHeader from './SimpleHeader'
import RowLink from './RowLink'
import Link from 'next/link'

interface BadstuDayProps {
  locationName: AllLocationNames
  location: BadstuAvailability
  compact?: boolean
  fullHeight?: boolean
  onLocateClick?: () => void
  className?: string
}

export default function BadstuDay({
  locationName,
  location,
  compact = false,
  fullHeight = false,
  onLocateClick,
  className,
}: BadstuDayProps) {
  return (
    <div
      className={[
        'relative w-full max-w-[calc(100vw-100px)] min-w-72 rounded-2xl bg-gray-200 md:w-64 dark:bg-slate-800 grow',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex h-full flex-col rounded-2xl">
        {!compact ? (
          <CoverHeader name={locationName} lastUpdated={location.updated} />
        ) : (
          <SimpleHeader date={location.date} lastUpdated={location.updated} />
        )}
        <div className={['relative h-full', fullHeight ? 'overflow-auto' : 'overflow-y-auto'].join(' ')}>
          {location.slots.length > 0 ? (
            <div className="divide-y divide-gray-400">
              {location.slots.map((slot) => (
                <RowLink key={slot.variation + slot.time} location={location} slot={slot} />
              ))}
            </div>
          ) : (
            <div className="mt-4 flex h-2/3 flex-col items-center justify-center gap-2 p-4 opacity-70">
              <CircleDashed className="ml-2 h-12 w-12 shrink-0 text-gray-500" />
              <div className="text-center">Ingen bookinger denne dagen</div>
            </div>
          )}
          {!fullHeight && (
            <div className="pointer-events-none sticky bottom-0 left-0 h-4 w-full bg-gradient-to-b from-transparent to-gray-200 dark:to-slate-800" />
          )}
        </div>
        <div className="grow" />
        <div className="m-2 flex justify-end [&:has(button)]:justify-between">
          {onLocateClick && (
            <button
              type="button"
              className="cursor-pointer rounded-full p-2 hover:shadow-2xl hover:outline-1"
              onClick={onLocateClick}
              aria-label="zoom to location"
            >
              <LocateFixed className="h-5 w-5" />
            </button>
          )}
          {!compact && (
            <Link
              className="mr-2 flex items-center gap-1 hover:underline"
              href={`/badstu/${locationName.replaceAll(' ', '-')}`}
            >
              Andre dager <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

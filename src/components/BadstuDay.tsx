'use client'

import * as R from 'remeda'
import { addMinutes, isAfter, isSameDay, parseISO } from 'date-fns'
import { useState } from 'react'
import { useSession } from 'next-auth/react'

import { Availability, AvailabilityResult } from '@/scraping/types'
import { cn } from '@/utils/cn'
import { createClickableBookingLink } from '@/utils/planyo-utils'
import Time from '@/components/Time'
import HouseIcon from '@/components/icons/HouseIcon'
import { Location, LocationDetails } from '@/scraping/metadata'
import { dateAndTimeToDate, toReadableDateWithWeekdayName } from '@/utils/date'
import NotifySlot from '@/components/NotifySlot'
import EditIcon from '@/components/icons/EditIcon'
import CrossIcon from '@/components/icons/CrossIcon'
import { NotifyClean } from '@/utils/notify'

interface BadstuDayProps {
  locationName: Location
  location: LocationDetails
  date: string
  times: AvailabilityResult
  notifies: NotifyClean[]
  noHeader?: boolean
}

export const BadstuDay = ({ locationName, location, date, times, notifies, noHeader }: BadstuDayProps) => {
  const session = useSession()
  const timesList = R.entries(times)
  const anythingAvailable = timesList.some(([, { available, isFullyBookable }]) => isFullyBookable || available > 0)
  const [isToggleMode, setToggleMode] = useState(false)

  return (
    <div
      id={date}
      key={date}
      className={cn(
        'dark:highlight-white rounded-lg border dark:border-none dark:bg-slate-800/70 dark:shadow-highlight-white',
      )}
    >
      {!noHeader && (
        <h2 className="text-md mx-4 my-2 flex justify-between font-bold">
          <span>{toReadableDateWithWeekdayName(date)}</span>
          {!anythingAvailable && <span className="md:hidden">Ingenting ledig</span>}
          {session.status === 'authenticated' && (
            <button
              onClick={() => setToggleMode((b) => !b)}
              className={cn('h-8 w-8 transition-transform', {
                'rotate-180': isToggleMode,
              })}
            >
              <EditIcon />
            </button>
          )}
        </h2>
      )}
      <ul className="grid grid-cols-1 divide-y dark:divide-white/10">
        {timesList.map(([time, availability]) => (
          <BookingListItem
            key={time}
            location={locationName}
            locationId={location.dropin}
            availability={availability}
            date={date}
            time={time}
            isToggleMode={isToggleMode}
            notifies={notifies}
          />
        ))}
      </ul>
    </div>
  )
}

interface BookingListItemProps {
  location: Location
  locationId: string
  time: string
  availability: Availability
  date: string
  isToggleMode: boolean
  notifies: NotifyClean[]
}

function BookingListItem({
  location,
  locationId,
  time,
  date,
  isToggleMode,
  availability: { available, isFullyBookable },
  notifies,
}: BookingListItemProps) {
  const hasAvailableSlots = available > 0
  const isTooLate = isAfter(new Date(), addMinutes(dateAndTimeToDate(date, time), 60))
  const hasNotify =
    notifies.find(
      (notify) =>
        isSameDay(parseISO(notify.date), dateAndTimeToDate(date, time)) &&
        notify.location === location &&
        notify.slot === time,
    ) != null

  return (
    <li
      className={cn('flex', {
        'bg-emerald-600/20 hover:bg-emerald-600/50': hasAvailableSlots,
        'bg-blue-600/20': hasNotify && !hasAvailableSlots && !isTooLate,
        'opacity-30': isTooLate,
      })}
    >
      {isToggleMode && !hasAvailableSlots && !isTooLate && (
        <NotifySlot location={location} className="" slot={time} date={date} hasNotify={hasNotify} />
      )}
      {hasAvailableSlots ? (
        <a
          href={createClickableBookingLink(locationId, date)}
          className="relative block flex h-full w-full justify-between p-2 px-4"
        >
          <span className="flex">
            <Time>{time}</Time>
            <div>{available} ledige</div>
          </span>
          <span className="absolute right-2 top-0 px-4 text-3xl">›</span>
        </a>
      ) : (
        <div
          className="flex items-center justify-between gap-3 px-4 py-2"
          title={isFullyBookable ? 'Denne badstuen kan fortsatt bookes privat' : undefined}
        >
          <div className="flex items-center">
            <Time>{time}</Time>
            {isFullyBookable ? (
              <div className="text-sm">Åpen for privat booking</div>
            ) : (
              <div className="flex items-center">{available || <CrossIcon />}</div>
            )}
          </div>
          {isFullyBookable && <HouseIcon />}
        </div>
      )}
    </li>
  )
}

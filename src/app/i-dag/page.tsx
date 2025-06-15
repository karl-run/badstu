import React, { ReactElement, Suspense } from 'react'
import { formatISO } from 'date-fns'
import Link from 'next/link'

import Container from '@/components/common/Container'
import BackToRoot from '@/components/common/BackToRoot'
import { BadstuDay } from '@/components/BadstuDay'
import { getDropins } from '@/service/booking-service'
import { Location, locations } from '@/scraping/metadata'
import { toReadableDateWithWeekdayName } from '@/utils/date'

function Page(): ReactElement {
  const today = formatISO(new Date())

  return (
    <Container>
      <BackToRoot />
      <h1 className="text-2xl font-bold">
        <span className="uppercase">I dag, {toReadableDateWithWeekdayName(today)}</span>
      </h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 mt-3">
        <div>
          <h1 className="text-md font-bold mb-1">
            <Link className="uppercase hover:underline" href="/kroloftet">
              Kroloftet
            </Link>
          </h1>
          <Suspense fallback={<div className="animate-pulse w-full h-96 bg-slate-700 rounded-xl" />}>
            <LocationToday today={today} location="kroloftet" />
          </Suspense>
        </div>
        <div>
          <h1 className="text-md font-bold mb-1">
            <Link className="uppercase hover:underline" href="/langkaia">
              Langkaia
            </Link>
          </h1>
          <Suspense fallback={<div className="animate-pulse w-full h-96 bg-slate-700 rounded-xl" />}>
            <LocationToday today={today} location="langkaia" />
          </Suspense>
        </div>
        <div>
          <h1 className="text-md font-bold mb-1">
            <Link className="uppercase hover:underline" href="/sukkerbiten">
              Sukkerbiten
            </Link>
          </h1>
          <Suspense fallback={<div className="animate-pulse w-full h-96 bg-slate-700 rounded-xl" />}>
            <LocationToday today={today} location="sukkerbiten" />
          </Suspense>
        </div>
      </div>
    </Container>
  )
}

async function LocationToday({ today, location }: { today: string; location: Location }): Promise<ReactElement> {
  const { result } = await getDropins(location)

  const timesToday = result.find(([date]) => date === today.slice(0, 10))

  if (!timesToday) {
    return <div>Noe rart har skjedd. Ingen booking data for {location} i dag 🤔</div>
  }

  return (
    <BadstuDay
      locationName="kroloftet"
      location={locations['kroloftet']}
      date={formatISO(new Date())}
      times={timesToday[1]}
      notifies={[]}
      noHeader
    />
  )
}

export default Page

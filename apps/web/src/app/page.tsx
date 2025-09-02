import OtherDayPicker from '@/components/OtherDayPicker'
import BadstuDay from '@/components/BadstuDay/BadstuDay'
import * as R from 'remeda'
import { Suspense } from 'react'
import logger from '@badstu/logger'
import { getAllAvailabilityForDate } from '@badstu/db/slots'

export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <div className="grid h-[calc(100svh-4rem)] grid-cols-1 grid-rows-[calc(70svh-4rem)_30svh]">
      <div className="flex flex-col">
        <div className="flex">
          <h2 className="shrink-0 p-4 text-xl">Badstuer i dag</h2>
          <OtherDayPicker />
        </div>
        <div className="mt-2 flex h-full max-w-screen gap-3 overflow-auto px-3 pb-3 md:h-auto md:min-h-96">
          <Suspense fallback={<RootBadstuSkeleton />}>
            <AllBadstusToday />
          </Suspense>
        </div>
      </div>
      <div>
        <div className="h-full w-full" />
      </div>
    </div>
  )
}

async function AllBadstusToday() {
  const startTime = Date.now()

  logger.info("Landing page, generating today's availability")
  const locations = await getAllAvailabilityForDate(new Date()).then(async (it) => {
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate delay for testing purposes

    const endTime = Date.now()
    logger.info(`Today's availability generated for ${Object.keys(it).length} locations, took ${endTime - startTime}ms`)
    return it
  })

  return (
    <>
      {R.entries(locations).map(([name, location]) => (
        <BadstuDay key={name} locationName={name} location={location} />
      ))}
    </>
  )
}

function RootBadstuSkeleton() {
  return (
    <>
      <div className="relative h-full w-full max-w-[calc(100vw-100px)] min-w-72 grow animate-pulse rounded-2xl bg-gray-200 md:w-64 md:grow dark:bg-slate-800"></div>
      <div className="relative h-full w-full max-w-[calc(100vw-100px)] min-w-72 grow animate-pulse rounded-2xl bg-gray-200 md:w-64 md:grow dark:bg-slate-800"></div>
      <div className="relative h-full w-full max-w-[calc(100vw-100px)] min-w-72 grow animate-pulse rounded-2xl bg-gray-200 md:w-64 md:grow dark:bg-slate-800"></div>
      <div className="relative h-full w-full max-w-[calc(100vw-100px)] min-w-72 grow animate-pulse rounded-2xl bg-gray-200 md:w-64 md:grow dark:bg-slate-800"></div>
    </>
  )
}

import BadstuCovers from './BadstuCovers'
import type { AllLocationNames } from '@badstu/data/meta'
import DiffSinceTimer from './DiffSinceTimer'
import Link from 'next/link'

interface CoverHeaderProps {
  name: AllLocationNames
  lastUpdated: Date | null
}

export default function CoverHeader({ name, lastUpdated }: CoverHeaderProps) {
  return (
    <Link className="group relative h-18 shrink-0 block" href={`/badstu/${name.replaceAll(' ', '-')}`}>
      <BadstuCovers
        location={name}
        className="pointer-events-none absolute inset-0 top-0 left-0 h-full w-full rounded-t-2xl opacity-70 group-hover:opacity-100"
      />
      <h2 className="flex h-full w-full items-center justify-center text-xl font-bold text-white drop-shadow-md drop-shadow-black">
        {name}
      </h2>
      {lastUpdated && (
        <div
          className="absolute right-0 bottom-2 mt-2 mr-2 flex flex-col items-center text-xs leading-3 font-bold text-white drop-shadow-md drop-shadow-black"
          title="Sist oppdatert"
        >
          <DiffSinceTimer lastUpdated={lastUpdated} /> min
        </div>
      )}
    </Link>
  )
}

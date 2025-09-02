import { toReadableDateWithWeekdayName } from '@/utils/date'
import DiffSinceTimer from './DiffSinceTimer'

interface SimpleHeaderProps {
  date: string
  lastUpdated: Date | null
}

export default function SimpleHeader({ date, lastUpdated }: SimpleHeaderProps) {
  return (
    <div className="flex">
      <h3 className="flex w-full items-center justify-center p-2 text-xl font-bold text-gray-700 dark:text-gray-200">
        {toReadableDateWithWeekdayName(date)}
      </h3>
      {lastUpdated && (
        <div className="mt-2 mr-2 flex flex-col items-center text-xs leading-3" title="Sist oppdatert">
          <div>
            <DiffSinceTimer lastUpdated={lastUpdated} />
          </div>
          <div>min</div>
        </div>
      )}
    </div>
  )
}

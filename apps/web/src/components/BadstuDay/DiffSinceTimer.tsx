'use client'

import { differenceInMinutes } from 'date-fns'
import { useEffect, useState } from 'react'

interface DiffSinceTimerProps {
  lastUpdated: Date
}

export default function DiffSinceTimer({ lastUpdated }: DiffSinceTimerProps) {
  const [counter, setCounter] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((c) => c + 1)
    }, 30_000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return <span key={counter}>{differenceInMinutes(new Date(), lastUpdated, { roundingMethod: 'round' })}</span>
}

import Link from 'next/link'
import Image from 'next/image'
import * as R from 'remeda'
import React from 'react'

import { Location, locationNames, locationToTitle } from '@/scraping/metadata'
import { cn } from '@/utils/cn'
import Container from '@/components/common/Container'
import { images } from '@/images/images'

export default async function Home() {
  return (
    <Container>
      <div className="mb-4 text-right">
        Badstu nå?{' '}
        <Link href="/i-dag" className="underline">
          Sjekk ledig dropin i dag
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {R.pipe(
          locationNames,
          R.map((location: Location, index) => (
            <Link
              key={location}
              href={`/${location}`}
              className="max-w-3xl overflow-hidden transition-transform hover:scale-105"
            >
              <span className="ml-4 font-bold uppercase">{locationToTitle(location)}</span>
              <Image
                src={images[location]}
                alt={locationToTitle(location)}
                className={cn('max-h-40 w-full rounded-2xl object-cover', {
                  'max-h-32': index >= 3,
                  grayscale: location.includes('naken'),
                })}
              />
            </Link>
          )),
        )}
      </div>
    </Container>
  )
}

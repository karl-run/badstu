import Link from 'next/link';
import Image from 'next/image';
import * as R from 'remeda';
import React from 'react';

import kroloftet from '../images/kroloftet.jpeg';
import sukkerbiten from '../images/sukkerbiten.jpg';
import langkaia from '../images/langkaia.jpeg';

import { locationNames, Location } from '@/scraping/metadata';
import NextAvailable from '@/components/NextAvailable';

const images: Record<Location, typeof kroloftet> = {
  kroloftet: kroloftet,
  sukkerbiten: sukkerbiten,
  langkaia: langkaia,
};

export default async function Home() {
  return (
    <main className="container mx-auto p-4 sm:p-16 sm:pt-2">
      <NextAvailable />
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {R.pipe(
          locationNames,
          R.map((location: Location) => (
            <Link
              key={location}
              href={`/${location}`}
              className="max-w-3xl overflow-hidden transition-transform hover:scale-105"
            >
              <span className="ml-4 font-bold uppercase">{location}</span>
              <Image
                src={images[location]}
                alt={location}
                className="max-h-96 w-full rounded-2xl object-cover"
              />
            </Link>
          )),
        )}
      </div>
    </main>
  );
}

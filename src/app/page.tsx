import Link from 'next/link';
import Image from 'next/image';
import * as R from 'remeda';
import React from 'react';

import kroloftet from '../images/kroloftet.jpeg';
import sukkerbiten from '../images/sukkerbiten.jpg';
import langkaia from '../images/langkaia.jpeg';

import { locationNames, Locations } from '@/scraping/metadata';

const images: Record<Locations, typeof kroloftet> = {
  kroloftet: kroloftet,
  sukkerbiten: sukkerbiten,
  langkaia: langkaia,
};

export default async function Home() {
  return (
    <main className="container mx-auto grid grid-cols-1 gap-8 p-4 sm:p-16 md:grid-cols-3">
      {R.pipe(
        locationNames,
        R.map((location: Locations) => (
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
    </main>
  );
}

import loadDynamic from 'next/dynamic';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getDropins } from '@/service/booking-service';
import { BadstuDay } from '@/components/BadstuDay';
import { locations, Location, validateLocation } from '@/scraping/metadata';
import ScrollToHash from "@/components/ScrollToHash";

const LastUpdated = loadDynamic(() => import('@/components/LastUpdated'), {
  ssr: false,
  loading: () => <p>Klokkeslettene</p>,
});

export const dynamic = 'force-dynamic';

type LocationPageMetadata = { slug: Location };

export default async function LocationPage({ params }: { params: LocationPageMetadata }) {
  try {
    validateLocation(params.slug);
  } catch (e) {
    console.error(`Someone tried to load ${params.slug} hmmm`);
    notFound();
  }

  const { result, timestamp } = await getDropins(params.slug);

  return (
    <main className="container mx-auto p-4 sm:p-16">
      <div className="mb-4 flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-2xl font-bold">
          <Link
            href="/"
            className="inline-flex h-8 w-8 items-center justify-center transition-transform hover:rotate-[359deg]"
          >
            ‹
          </Link>
          <span className="uppercase">{params.slug}</span> Drop-in
        </h1>
        {timestamp && <LastUpdated generatedAt={timestamp} location={params.slug} />}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {result.map(([date, times]) => (
          <BadstuDay key={date} location={locations[params.slug]} date={date} times={times} />
        ))}
        {result.length === 0 && (
          <div>Fant ingen tider. Virker som noe er ødelagt! Kom tilbake senere.</div>
        )}
      </div>
      <ScrollToHash />
    </main>
  );
}

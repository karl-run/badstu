import dynamic from 'next/dynamic';

import { getDropins } from '@/service/booking-service';
import { BadstuDay } from "@/components/BadstuDay";

const LastUpdated = dynamic(() => import('@/components/LastUpdated'), {
  ssr: false,
  loading: () => <p>Klokkeslettene</p>,
});

export const revalidate = 10;

export default async function Home() {
  const { result, timestamp } = await getDropins('kroloftet');

  return (
    <main className="container mx-auto p-4 sm:p-16">
      <div className="mb-4 flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-2xl font-bold">Kroloftet Drop-in</h1>
        {timestamp && <LastUpdated generatedAt={timestamp} />}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {result.map(([date, times]) => (
          <BadstuDay key={date} date={date} times={times} />
        ))}
      </div>
      <GeneratedAt />
    </main>
  );
}

const GeneratedAt = () => (
  <p className="mt-8 text-right text-slate-100/30">Generert {new Date().toISOString()}</p>
);

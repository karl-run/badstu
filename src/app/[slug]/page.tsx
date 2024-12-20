import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { getDropins } from '@/service/booking-service';
import { BadstuDay } from '@/components/BadstuDay';
import { locations, Location, validateLocation, locationToTitle } from '@/scraping/metadata';
import ScrollToHash from '@/components/client/ScrollToHash';
import { getNotifies } from '@/db/user';
import { authOptions } from '@/app/api/auth/[...nextauth]/_route';
import { toCleanNotify } from '@/utils/notify';
import Container from '@/components/common/Container';
import BackToRoot from '@/components/common/BackToRoot';
import { LastUpdatedLazy } from '@/components/LastUpdatedLazy';

export const dynamic = 'force-dynamic';

type LocationPageMetadata = { slug: Location };

export default async function LocationPage(props: { params: Promise<LocationPageMetadata> }) {
  const params = await props.params;
  try {
    validateLocation(params.slug);
  } catch (e) {
    console.error(`Someone tried to load ${params.slug} hmmm`);
    notFound();
  }

  const session = await getServerSession(authOptions);
  const { result, timestamp } = await getDropins(params.slug);
  const notifies = session?.user?.email ? await getNotifies(session.user.email) : [];

  return (
    <Container>
      <BackToRoot />
      <div className="mb-4 flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-2xl font-bold">
          <span className="uppercase">{locationToTitle(params.slug)}</span> Drop-in
        </h1>
        {timestamp && <LastUpdatedLazy generatedAt={timestamp} location={params.slug} />}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {result.map(([date, times]) => (
          <BadstuDay
            key={date}
            locationName={params.slug}
            location={locations[params.slug]}
            date={date}
            times={times}
            notifies={notifies.map(toCleanNotify)}
          />
        ))}
        {result.length === 0 && (
          <div>Fant ingen tider. Virker som noe er ødelagt! Kom tilbake senere.</div>
        )}
      </div>
      <ScrollToHash />
    </Container>
  );
}

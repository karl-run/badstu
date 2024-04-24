import { Location, locations, Locations } from '@/scraping/metadata';
import { getFirebaseDocuments } from '@/scraping/firescraper';

export async function getLocation(location: Location) {
  const deets = locations[location];

  const documents = await getFirebaseDocuments(deets.privat!);

  return documents;
}

// @ts-ignore
await getLocation('kroloftet');

// @ts-ignore
Bun.write('debug-privat.json', JSON.stringify(await getLocation('kroloftet'), null, 2));

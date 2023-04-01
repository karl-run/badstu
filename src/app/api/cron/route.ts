import { locationNames } from '@/scraping/metadata';

const HOST = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';

export const dynamic = 'force-dynamic';

export const GET = async (request: Request): Promise<Response> => {
  console.log('Running cron job...');

  try {
    await Promise.all(locationNames.map(fetchAndRevalidate));

    return new Response('OK', { status: 200 });
  } catch (e) {
    console.error(e);
    return new Response('Error', { status: 500 });
  }
};

const throwFetch = (...args: Parameters<typeof fetch>): Promise<Response> => {
  console.log(`Fetching ${args[0]}...`);
  return fetch(...args).then((response) => {
    if (response.ok) {
      console.log(`${args[0]} OK ${response.status}`);
      return response;
    } else {
      console.error(`${args[0]} ${response.status} ${response.statusText}`);
      throw new Error(`Request failed with status ${response.status}`);
    }
  });
};

const fetchAndRevalidate = async (location: string): Promise<void> => {
  await throwFetch(HOST + `/api/scrape?source=cron&location=${location}`, { method: 'POST' });
  await throwFetch(HOST + `/api/revalidate?location=${location}`, { method: 'POST' });
};

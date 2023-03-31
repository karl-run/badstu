const HOST = `https://${process.env.VERCEL_URL}` ?? 'http://localhost:3000';

export const GET = async (request: Request): Promise<Response> => {
  try {
    await throwFetch(HOST + '/api/scrape?source=cron', { method: 'POST' });
    await throwFetch(HOST + '/api/revalidate', { method: 'POST' });

    return new Response('OK', { status: 200 });
  } catch (e) {
    console.error(e);
    return new Response('Error', { status: 500 });
  }
};

const throwFetch = (...args: Parameters<typeof fetch>): Promise<Response> =>
  fetch(...args).then((response) => {
    if (response.ok) {
      return response;
    } else {
      throw new Error(`Request failed with status ${response.status}`);
    }
  });

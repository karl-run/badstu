import { NextApiRequest, NextApiResponse } from 'next';

import { locationNames, validateLocation } from '@/scraping/metadata';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const location = req.query.location;

  try {
    if (!location) {
      console.log('Revalidating all locations');
      await Promise.all(locationNames.map((location) => res.revalidate(`/${location}`)));
    } else {
      const validatedLocation = validateLocation((location as string | null) ?? null);
      console.log(`Revalidating ${validatedLocation}`);
      await res.revalidate(`/${validatedLocation}`);
    }

    return res.json({ revalidated: true });
  } catch (err) {
    return res.status(500).send('Error revalidating');
  }
}

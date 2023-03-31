import { NextApiRequest, NextApiResponse } from 'next';
import * as R from 'remeda';

import { locations, validateLocation } from '@/scraping/metadata';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const location = req.query.location;

  try {
    if (!location) {
      await Promise.all(R.keys(locations).map((location) => res.revalidate(`/${location}`)));
    } else {
      const validatedLocation = validateLocation((location as string | null) ?? null);
      await res.revalidate(`/${validatedLocation}`);
    }

    return res.json({ revalidated: true });
  } catch (err) {
    return res.status(500).send('Error revalidating');
  }
}

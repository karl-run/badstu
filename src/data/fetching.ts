import * as E from 'fp-ts/Either';

import { Location } from '@/scraping/metadata';

export const triggerScrape = async (location: Location): Promise<E.Either<string, string>> => {
  const response = await fetch(`/api/scrape?source=app&location=${location}`, {
    method: 'POST',
  });

  if (response.ok) {
    return E.right('Scrape OK');
  } else {
    return E.left('Scrape failed');
  }
};

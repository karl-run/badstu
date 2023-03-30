import * as E from 'fp-ts/Either';

export const triggerScrape = async (): Promise<E.Either<string, string>> => {
  const response = await fetch('/api/scrape?source=app', {
    method: 'POST',
  });

  if (response.ok) {
    return E.right('Scrape OK');
  } else {
    return E.left('Scrape failed');
  }
};

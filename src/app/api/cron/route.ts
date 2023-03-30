import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';

const HOST = process.env.VERCEL_URL ?? 'http://localhost:3000';

export const GET = async (request: Request): Promise<Response> =>
  pipe(
    eitherFetch(HOST + '/api/scrape', { method: 'POST' }),
    TE.chain(() => eitherFetch(HOST + '/api/revalidate', { method: 'POST' })),
    TE.mapLeft(toErrorResponse),
    TE.map(toSuccessResponse),
    TE.toUnion,
  )();

export const eitherFetch = (...args: Parameters<typeof fetch>): TE.TaskEither<Error, Response> =>
  TE.tryCatch(async () => {
    console.log('Fetching', args[0]);
    const response = await fetch(...args);
    if (response.ok) {
      return response;
    } else {
      throw new Error(`Request failed with status ${response.status}`);
    }
  }, E.toError);

const toErrorResponse = (error: Error) => new Response(error.message ?? 'No idea', { status: 500 });

const toSuccessResponse = (response: Response) => new Response('OK', { status: response.status });

import { nextAvailableLocation } from '@/db/location';

export const dynamic = 'force-dynamic';

export async function GET() {
  const result = await nextAvailableLocation();

  // @ts-expect-error - Types are wrong
  return Response.json(result);
}

import { NextResponse } from 'next/server';

import { nextAvailableLocation } from '@/db/location';

export const dynamic = 'force-dynamic';

export async function GET() {
  const result = await nextAvailableLocation();

  return NextResponse.json(result);
}

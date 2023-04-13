import { Request } from 'next/dist/compiled/@edge-runtime/primitives/fetch';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { parseISO } from 'date-fns';

import { Location, validateLocation } from '@/scraping/metadata';
import { addNotify } from '@/db/user';
import { authOptions } from '@/app/api/auth/[...nextauth]/_route';

type Params = {
  params: { slug: Location };
};

export async function PUT(request: Request, { params }: Params) {
  validateLocation(params.slug);

  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ message: 'Not logged in' }, { status: 401 });
  }

  const body: { slot: string; date: string } = await request.json();

  await addNotify({
    id: session.user.email,
    date: parseISO(body.date),
    slot: body.slot,
    location: params.slug,
  });

  return NextResponse.json({ ok: 'ok' });
}

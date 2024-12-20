import { Request } from 'next/dist/compiled/@edge-runtime/primitives/fetch';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { parseISO } from 'date-fns';

import { Location, validateLocation } from '@/scraping/metadata';
import { addNotify, removeNotify } from "@/db/user";
import { authOptions } from '@/app/api/auth/[...nextauth]/_route';

type Params = {
  params: Promise<{ slug: Location }>;
};

export async function PUT(request: Request, props: Params) {
  const params = await props.params;
  validateLocation(params.slug);

  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ message: 'Not logged in' }, { status: 401 });
  }

  const body: { slot: string; date: string; add: boolean } = await request.json();

  if (body.add) {
    await addNotify({
      id: session.user.email,
      date: parseISO(body.date),
      slot: body.slot,
      location: params.slug,
    });
    return NextResponse.json({ ok: 'added' });
  } else {
    await removeNotify({
      id: session.user.email,
      date: parseISO(body.date),
      slot: body.slot,
      location: params.slug,
    })
    return NextResponse.json({ ok: 'removed' });
  }
}

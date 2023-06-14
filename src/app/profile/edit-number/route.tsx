import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

import { updatePhoneNumber } from '@/db/user';
import { authOptions } from '@/app/api/auth/[...nextauth]/_route';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const body = await request.json();

  if (!session?.user?.email) {
    return NextResponse.json({ message: 'Not logged in' }, { status: 401 });
  }

  await updatePhoneNumber(session.user.email, body.phoneNumber);

  return NextResponse.json({ ok: 'ok' });
}

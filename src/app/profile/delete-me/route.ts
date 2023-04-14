import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

import { authOptions } from '@/app/api/auth/[...nextauth]/_route';
import { deleteMe } from '@/db/user';

export async function POST(request: Request) {
  const { user } = await request.json();
  const session = await getServerSession(authOptions);

  if (session?.user?.email == null) {
    return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
  }

  if (user !== session.user.email) {
    return NextResponse.json({ error: 'Invalid user' }, { status: 403 });
  }

  await deleteMe(session.user.email);

  return NextResponse.json({ deleted: true });
}

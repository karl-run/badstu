import { notifyUser } from '@/notifications/twilio';

export async function POST(request: Request) {
  const body = await request.json();
  await notifyUser({
    phoneNumber: body.phoneNumber,
    message: body.message,
  });

  return new Response('ok');
}

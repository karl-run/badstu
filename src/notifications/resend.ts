import { Resend } from 'resend';

let resend: Resend | null;
function getResend() {
  if (!resend) resend = new Resend(process.env.RESEND_TOKEN);

  return resend;
}

export async function emailUser(user: string, email: { title: string; body: string }) {
  console.info(`Emailing user ${user}`);

  console.log(email.body);

  const result = await getResend().emails.send({
    from: 'badstu@badstu.karl.run',
    to: user,
    subject: email.title,
    html: email.body,
  });

  console.log('email response', result);

  return result;
}

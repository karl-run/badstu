import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function emailUser(user: string, email: { title: string; body: string }) {
  console.info(`Emailing user ${user}`);

  console.log(email.body);

  const result = await resend.emails.send({
    from: 'badstu@badstu.karl.run',
    to: user,
    subject: email.title,
    html: email.body,
  });

  console.log('email response', result);
}

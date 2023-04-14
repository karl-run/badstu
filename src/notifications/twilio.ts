import { Twilio } from 'twilio';

const client = new Twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

type NotifyUser = {
  phoneNumber: string;
  message: string;
};
export async function notifyUser({ phoneNumber, message }: NotifyUser): Promise<boolean> {
  const result = await client.messages.create({
    from: process.env.TWILIO_FROM,
    to: phoneNumber,
    body: message,
  });

  console.log(`Sent SMS with SID: ${result.sid}`);

  return true;
}

import { Twilio } from 'twilio';

let twilio: Twilio | null;
function getTwilio() {
  if (!twilio) twilio = new Twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

  return twilio;
}

type NotifyUser = {
  phoneNumber: string;
  message: string;
};
export async function notifyUser({ phoneNumber, message }: NotifyUser): Promise<boolean> {
  const result = await getTwilio().messages.create({
    from: process.env.TWILIO_FROM,
    to: phoneNumber,
    body: message,
  });

  console.log(`Sent SMS with SID: ${result.sid}`);

  return true;
}

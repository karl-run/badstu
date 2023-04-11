import { Cron } from './deps.ts';

console.log('Setting up minute cron job');

const job = new Cron('* * * * *', async () => {
  await Promise.all(['kroloftet', 'sukkerbiten', 'langkaia'].map(scrape));
});

async function scrape(location: string) {
  console.log(`Time to poll location ${location}`);

  const response = await fetch(
    `https://badstu.karl.run/api/scrape?source=cron&location=${location}`,
    {
      method: 'POST',
    },
  );

  if (response.ok) {
    console.log(`${location} OK ${response.status}`);
  } else {
    console.error(`${location} ${response.status} ${response.statusText}`);
  }
}

console.log(`Started... job will run ${job.nextRun()?.toLocaleTimeString() ?? 'never somehow?'}`);

Deno.addSignalListener('SIGINT', () => {
  console.log('SIGINT received, exiting...');
  job.stop();
  Deno.exit(0);
});

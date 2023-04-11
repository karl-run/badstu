import { Cron } from './deps.ts';

logWithTimestamp('Setting up minute cron job');

const job = new Cron('* * * * *', async () => {
  await Promise.all(['kroloftet', 'sukkerbiten', 'langkaia'].map(scrape));
});

async function scrape(location: string) {
  logWithTimestamp(`Time to poll location ${location}`);

  const response = await fetch(
    `https://badstu.karl.run/api/scrape?source=cron&location=${location}`,
    {
      method: 'POST',
    },
  );

  if (response.ok) {
    logWithTimestamp(`${location} OK ${response.status}`);
  } else {
    errorWithTimestamp(`${location} ${response.status} ${response.statusText}`);
  }
}

function logWithTimestamp(message: string) {
  console.log(`${new Date().toISOString()}: ${message}`);
}

function errorWithTimestamp(message: unknown) {
  console.error(`${new Date().toISOString()}`, message);
}

logWithTimestamp(
  `Started... job will run ${job.nextRun()?.toLocaleTimeString() ?? 'never somehow?'}`,
);

Deno.addSignalListener('SIGINT', () => {
  logWithTimestamp('SIGINT received, exiting...');
  job.stop();
  Deno.exit(0);
});

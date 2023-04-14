import { Cron } from './deps.ts';

logWithTimestamp('Setting up scrape cron job');

const job = new Cron('* * * * *', async () => {
  await Promise.all(['kroloftet', 'sukkerbiten', 'langkaia'].map(scrape));
});

logWithTimestamp('Setting up notify cron job');

const notifyJob = new Cron('*/2 * * * *', async () => {
  logWithTimestamp(`Notify: Time to start notify job`);

  let response: Response;
  try {
    response = await fetch(`https://badstu.karl.run/api/notify`, { method: 'POST' });
  } catch (e) {
    errorWithTimestamp(new Error(`Notify: Error in notify job`, { cause: e }));
    return;
  }

  if (response.ok) {
    logWithTimestamp(`Notify: Notify job OK ${response.status}`);
  } else {
    errorWithTimestamp(`Notify: Notify job BAD ${response.status} ${response.statusText}`);
  }
});

async function scrape(location: string) {
  logWithTimestamp(`Scrape: Time to poll location ${location}`);

  let response: Response;
  try {
    response = await fetch(`https://badstu.karl.run/api/scrape?source=cron&location=${location}`, {
      method: 'POST',
    });
  } catch (e) {
    errorWithTimestamp(new Error(`Scrape: Error scraping ${location}`, { cause: e }));
    return;
  }

  if (response.ok) {
    logWithTimestamp(`Scrape: ${location} OK ${response.status}`);
  } else {
    errorWithTimestamp(`Scrape: ${location} ${response.status} ${response.statusText}`);
  }
}

function logWithTimestamp(message: string) {
  console.log(`${new Date().toISOString()}: ${message}`);
}

function errorWithTimestamp(message: unknown) {
  console.error(`${new Date().toISOString()}`, message);
}

logWithTimestamp(
  `Scrape: Started... job will run ${job.nextRun()?.toLocaleTimeString() ?? 'never somehow?'}`,
);
logWithTimestamp(
  `Notify: Started... job will run ${
    notifyJob.nextRun()?.toLocaleTimeString() ?? 'never somehow?'
  }`,
);

Deno.addSignalListener('SIGINT', () => {
  logWithTimestamp('SIGINT received, exiting...');
  job.stop();
  Deno.exit(0);
});

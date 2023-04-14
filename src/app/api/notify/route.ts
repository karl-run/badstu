import * as R from 'remeda';
import { Notify, User } from '@prisma/client';
import { NextResponse } from 'next/server';

import { getValidUsers, markNotifyNotified } from '@/db/user';
import { getLocation, jsonToExtractedDays } from '@/db/location';
import { ExtractedDay } from '@/scraping/types';
import { dateAndTimeToDate, toDateString } from '@/utils/date';
import { notifyUser } from '@/notifications/twilio';

export async function POST() {
  console.log('Starting notify job');

  const users = await getValidUsers();
  const locationsInQuestion = await R.pipe(
    users,
    R.flatMap(R.prop('notifies')),
    R.map(R.prop('location')),
    R.uniq(),
    R.map(getLocation),
    async (it) => await Promise.all(it),
    async (it) => R.compact(await it),
  );

  console.log(`Found ${users.length} users and ${locationsInQuestion.length} relevant locations`);

  const locationToDaysTuple = R.pipe(
    locationsInQuestion,
    R.map((it) => [it.name, jsonToExtractedDays(it.dropins)] as [string, ExtractedDay[]]),
  );

  try {
    await findAndNotify(users, locationToDaysTuple);
    return NextResponse.json({ ok: 'ok' });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Something went wrong.' });
  }
}

async function findAndNotify(
  users: (User & { notifies: Notify[] })[],
  locationToDaysTuple: [string, ExtractedDay[]][],
) {
  for (const user of users) {
    const filtersToNotify = user.notifies.filter((notify) =>
      locationToDaysTuple.find(([location, days]) => doesNotifyHasAvailability(notify, days)),
    );

    for (const toNotify of filtersToNotify) {
      if (user.number == null) {
        throw new Error(
          `User ${user.id} has no phone number. This should not happen. Is the prisma query broken?`,
        );
      }

      console.log('Sending notification to user');
      const result = await notifyUser({
        phoneNumber: user.number,
        message: createNotifyMessage(toNotify),
      });

      if (result) {
        console.log('Marking the notify as notified');
        await markNotifyNotified(toNotify.id);
      }
    }
  }
}

function doesNotifyHasAvailability(notify: Notify, location: ExtractedDay[]) {
  const notifyDateString = toDateString(notify.date);
  const notifyDateTime = dateAndTimeToDate(toDateString(notify.date), notify.slot);

  return location.find((it) => {
    if (it.date !== notifyDateString) return false;

    return it.times[notify.slot] > 0;
  });
}

function createNotifyMessage(toNotify: Notify) {
  return `Det har dukket opp ledige plasser på ${toNotify.location} ${toDateString(
    toNotify.date,
  )} kl. ${toNotify.slot}!\n\nhttps://badstu.karl.run/${toNotify.location}?scrollTo=${toDateString(
    toNotify.date,
  )}`;
}

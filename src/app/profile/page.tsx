import React from 'react';
import { getServerSession, Session } from 'next-auth';
import Image from 'next/image';

import { authOptions } from '@/app/api/auth/[...nextauth]/_route';
import { getAllTimeNotifyCount, getNotifies, getUserPhoneNumber } from '@/db/user';
import { metadata } from '@/app/layout';
import { FormInput, FormLabel } from '@ariakit/react';
import PhoneInput from '@/components/client/Input/PhoneInput';
import Link from 'next/link';
import DeleteMeButton from '@/components/client/DeleteMeButton';

async function Page(): Promise<JSX.Element> {
  const session = await getServerSession(authOptions);
  const notifies = await getAllTimeNotifyCount(session?.user?.email ?? '');

  return (
    <main className="container mx-auto p-4 sm:p-16 sm:pt-2">
      <div className="-ml-3 mb-2">
        <Link href="/">
          <span>‹</span> Tilbake til hovedsiden
        </Link>
      </div>
      <h1 className="mb-4 text-2xl font-bold">Min profil</h1>
      {session?.user == null ? (
        <p>Du er ikke logget inn</p>
      ) : (
        <LoggedInUser
          user={session.user}
          metadata={{
            allTimeNotifies: notifies.allTime,
            notified: notifies.notified,
            phone: await getUserPhoneNumber(session?.user?.email ?? ''),
          }}
        />
      )}
    </main>
  );
}

interface UserMetadata {
  allTimeNotifies: number;
  notified: number;
  phone: string | null;
}

function LoggedInUser({
  user,
  metadata,
}: {
  user: NonNullable<Session['user']>;
  metadata: UserMetadata;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded border p-4">
        <h2 className="mb-4 text-lg font-bold">Informasjon</h2>
        <div className="flex gap-2">
          {user.image && <Image src={user.image} height={48} width={48} alt="profile image" />}
          <div>
            <p>{user.name}</p>
            <p>{user.email}</p>
          </div>
        </div>
        <div className="mt-4">
          <p className="max-w-prose">
            Du har bedt om å blitt varslet på{' '}
            <span className="font-bold">{metadata.allTimeNotifies}</span> tidspunkter, hvor du har
            blitt fortalt om ledige plasser på{' '}
            <span className="font-bold">{metadata.notified}</span>.
          </p>
        </div>
      </div>
      <Notifications userPhone={metadata.phone} />
      <DeleteMe userId={user.email ?? 'unknown-email'} />
    </div>
  );
}

function Notifications({ userPhone }: { userPhone: string | null }): JSX.Element {
  return (
    <div className="rounded border p-4">
      <h2 className="mb-4 text-lg font-bold">Varsling</h2>
      <p>For å bli varslet må du legge inn et gyldig mobilnummer.</p>
      <PhoneInput key={userPhone} userPhone={userPhone} />
    </div>
  );
}

function DeleteMe({ userId }: { userId: string }) {
  return (
    <div className="rounded border p-4">
      <h2 className="mb-4 text-lg font-bold">Slett meg</h2>
      <p className="mt-4 max-w-prose">
        Alt vi har lagret om deg, inkludert varslinger vil bli slettet øyeblikkelig dersom du velger
        å gjøre det.
      </p>
      <DeleteMeButton userId={userId} />
    </div>
  );
}

export default Page;

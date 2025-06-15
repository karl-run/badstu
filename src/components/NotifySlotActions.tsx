'use server'

import { getServerSession } from 'next-auth'
import { parseISO } from 'date-fns'
import { revalidatePath } from 'next/cache'

import { validateLocation } from '@/scraping/metadata'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'
import { addNotify, removeNotify } from '@/db/user'

type ToggleProps = {
  location: string
  slot: string
  date: string
  add: boolean
}

export async function toggleNotifySlot({ location, slot, date, add }: ToggleProps): Promise<'added' | 'removed'> {
  const validatedLocation = validateLocation(location)

  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    throw new Error('Not logged in')
  }

  if (add) {
    await addNotify({
      id: session.user.email,
      date: parseISO(date),
      slot: slot,
      location: validatedLocation,
    })

    revalidatePath(`/${validatedLocation}`)

    return 'added'
  } else {
    await removeNotify({
      id: session.user.email,
      date: parseISO(date),
      slot: slot,
      location: validatedLocation,
    })

    revalidatePath(`/${validatedLocation}`)

    return 'removed'
  }
}

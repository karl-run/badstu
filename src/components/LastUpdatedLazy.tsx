'use client'

import loadDynamic from 'next/dynamic'

export const LastUpdatedLazy = loadDynamic(() => import('./LastUpdated'), {
  ssr: false,
  loading: () => <p>Klokkeslettene</p>,
})

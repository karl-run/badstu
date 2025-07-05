import { drizzle } from 'drizzle-orm/libsql'

import * as schema from './schema'

console.log('HEY!!!', process.env.TURSO_DATABASE_URL)

export const db = drizzle({
  schema,
  connection: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
})

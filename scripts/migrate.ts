import { migrate } from 'drizzle-orm/libsql/migrator';

import db, { disconnect } from '../src/db/db';

// @ts-expect-error this be bun
await migrate(db, { migrationsFolder: './migrations' });

disconnect();

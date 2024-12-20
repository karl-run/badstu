import { migrate } from 'drizzle-orm/libsql/migrator';

import db, { disconnect } from '../src/db/db';

await migrate(db, { migrationsFolder: './migrations' });

disconnect();

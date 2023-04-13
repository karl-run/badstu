import NextAuth from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/_route';

export default NextAuth(authOptions);

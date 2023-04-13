// As long as this is named _route.ts it wont be used as a route.
// Temporarily using pages as a workaround.

import NextAuth, { AuthOptions } from 'next-auth';
import Google from 'next-auth/providers/google';
import { insertUser } from '@/db/user';

export const authOptions: AuthOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      console.log(`User logged in with ${account?.provider ?? 'no provider'}`);

      if (profile?.email) {
        await insertUser(profile.email);
      }

      return true;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

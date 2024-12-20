import { AuthOptions } from 'next-auth';
import Google from 'next-auth/providers/google';
import { insertUser } from '@/db/user';

export const authOptions: AuthOptions = {
  theme: {
    logo: '/logo.png',
    colorScheme: 'dark',
    brandColor: '#4000a2',
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      // Hackily add isAdmin to the session, TODO: type it properly
      if (session.user?.email === process.env.ADMIN_EMAIL) {
        (session.user as any).isAdmin = true;
      }

      return session;
    },
    async signIn({ account, profile }) {
      console.log(`User logged in with ${account?.provider ?? 'no provider'}`);

      if (profile?.email) {
        await insertUser(profile.email);
      }

      return true;
    },
  },
};

// types/next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      accessToken?: string;
      refreshToken?: string;
      provider?: string;
    };
    error?: string;
  }

  interface User extends DefaultUser {
    accessToken?: string;
    refreshToken?: string;
    provider?: string;
  }
}

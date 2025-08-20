import type { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      provider: string;
    } & DefaultSession['user'];
    accessToken?: string;
  }

  interface User extends DefaultUser {
    id: string;
    provider: string;
  }
}

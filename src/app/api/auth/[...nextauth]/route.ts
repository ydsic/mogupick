import NextAuth from 'next-auth/next';
import { authOptions } from '@/lib/auth/authOptions';

export const runtime = 'nodejs';

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };


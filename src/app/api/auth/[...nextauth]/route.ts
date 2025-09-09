import NextAuth from 'next-auth/next';
import { authOptions } from '../../../../lib/auth/authOptions';

export const runtime = 'nodejs';

/** -------------------------------
 *  Refresh token helpers
 *  나중에 소셜로그인이 늘어날 경우 코드 분리
 * ------------------------------- */

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

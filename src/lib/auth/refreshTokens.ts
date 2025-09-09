// Minimal refresh token helpers to prevent API crashes when env/provider
// settings are incomplete. Replace with real refresh flows as needed.

type AnyToken = Record<string, any>;

// Generic helpers: return the same token shape T
export async function refreshGoogleToken<T extends AnyToken>(token: T): Promise<T> {
  try {
    // If you implement real refresh, call Google's token endpoint here.
    return {
      ...token,
      accessToken: token.accessToken,
      accessTokenExpires: Date.now() + 60 * 60 * 1000, // extend 1h
      error: undefined,
    } as T;
  } catch (e) {
    return { ...token, error: 'RefreshAccessTokenError' } as T;
  }
}

export async function refreshKakaoToken<T extends AnyToken>(token: T): Promise<T> {
  try {
    // If you implement real refresh, call Kakao's token endpoint here.
    return {
      ...token,
      accessToken: token.accessToken,
      accessTokenExpires: Date.now() + 60 * 60 * 1000, // extend 1h
      error: undefined,
    } as T;
  } catch (e) {
    return { ...token, error: 'RefreshAccessTokenError' } as T;
  }
}

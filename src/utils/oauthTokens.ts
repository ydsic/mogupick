"use client";

// Lightweight token storage for OAuth redirects

type StoredTokens = {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number; // epoch ms
};

const STORAGE_KEY = "oauth.tokens";

function safeParse<T>(v: string | null): T | null {
  if (!v) return null;
  try {
    return JSON.parse(v) as T;
  } catch {
    return null;
  }
}

export function saveTokens(tokens: {
  accessToken: string;
  refreshToken?: string;
  expiresInSeconds?: number | string;
}) {
  if (typeof window === "undefined") return;
  const expiresInMs = tokens.expiresInSeconds
    ? Number(tokens.expiresInSeconds) * 1000
    : undefined;
  const data: StoredTokens = {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    expiresAt: expiresInMs ? Date.now() + expiresInMs : undefined,
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore storage errors
  }
}

export function getStoredTokens(): StoredTokens | null {
  if (typeof window === "undefined") return null;
  return safeParse<StoredTokens>(localStorage.getItem(STORAGE_KEY));
}

export function getLocalAccessToken(): string | null {
  const tokens = getStoredTokens();
  if (!tokens?.accessToken) return null;
  if (tokens.expiresAt && Date.now() > tokens.expiresAt) return null;
  return tokens.accessToken;
}

export function clearTokens() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function parseTokensFromSearch(search: string) {
  const params = new URLSearchParams(search.startsWith("?") ? search : `?${search}`);
  const accessToken = params.get("accessToken") || params.get("access_token");
  const refreshToken = params.get("refreshToken") || params.get("refresh_token") || undefined;
  const expiresIn = params.get("expiresIn") || params.get("expires_in") || undefined;
  const redirect = params.get("redirect") || params.get("redirectTo") || undefined;
  return { accessToken: accessToken || undefined, refreshToken, expiresInSeconds: expiresIn || undefined, redirect };
}


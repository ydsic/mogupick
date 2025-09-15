"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { parseTokensFromSearch, saveTokens } from "@/utils/oauthTokens";

export default function OAuthRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    try {
      const { accessToken, refreshToken, expiresInSeconds, redirect } = parseTokensFromSearch(window.location.search);

      if (accessToken) {
        saveTokens({ accessToken, refreshToken, expiresInSeconds });
      }

      // Prefer explicit redirect param; fallback to home.
      const to = redirect && redirect.startsWith("/") ? redirect : "/";
      router.replace(to);
    } catch {
      // If anything goes wrong, just send to login or home
      router.replace("/");
    }
  }, [router]);

  // No UI needed
  return null;
}


'use client';
import { create } from 'zustand';
import { getApiBaseUrl } from '@/lib/config';
import { saveTokens, clearTokens } from '@/utils/oauthTokens';

interface LoginResponse {
  memberId: number;
  accessToken: string;
  refreshToken: string;
}

interface AuthState {
  memberId?: number;
  accessToken?: string;
  refreshToken?: string;
  // 프로필 정보 추가
  email?: string;
  name?: string;
  nickname?: string | null;
  provider?: string | null;

  isLoggedIn: boolean;
  loading: boolean;
  error?: string;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hydrate: () => void; // localStorage -> state 복원
  // 프로필 저장 액션
  setProfile: (p: {
    email?: string;
    name?: string;
    nickname?: string | null;
    provider?: string | null;
  }) => void;
}

const AUTH_STORAGE_KEY = 'auth.credentials';

function persist(data: Partial<AuthState>) {
  if (typeof window === 'undefined') return;
  try {
    const { memberId, accessToken, refreshToken, email, name, nickname, provider } = data as any;
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({ memberId, accessToken, refreshToken, email, name, nickname, provider }),
    );
  } catch {}
}

function loadPersisted(): Pick<
  AuthState,
  'memberId' | 'accessToken' | 'refreshToken' | 'email' | 'name' | 'nickname' | 'provider'
> | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return {
      memberId: parsed.memberId,
      accessToken: parsed.accessToken,
      refreshToken: parsed.refreshToken,
      email: parsed.email,
      name: parsed.name,
      nickname: parsed.nickname ?? null,
      provider: parsed.provider ?? null,
    };
  } catch {
    return null;
  }
}

export const useAuthStore = create<AuthState>((set, get) => ({
  memberId: undefined,
  accessToken: undefined,
  refreshToken: undefined,
  email: undefined,
  name: undefined,
  nickname: null,
  provider: null,
  isLoggedIn: false,
  loading: false,
  error: undefined,

  hydrate: () => {
    const data = loadPersisted();
    if (data?.accessToken) {
      set({
        ...data,
        isLoggedIn: true,
      });
      // oauthTokens 스토리지에도 저장 (authFetch 재사용 위해)
      saveTokens({ accessToken: data.accessToken!, refreshToken: data.refreshToken });
    } else if (data) {
      // 토큰은 없지만 프로필만 있는 경우에도 복원
      set({ ...data });
    }
  },

  setProfile: (p) => {
    const current = get();
    const next = {
      memberId: current.memberId,
      accessToken: current.accessToken,
      refreshToken: current.refreshToken,
      email: p.email ?? current.email,
      name: p.name ?? current.name,
      nickname: p.nickname ?? current.nickname ?? null,
      provider: p.provider ?? current.provider ?? null,
    } as Partial<AuthState>;
    set(next as AuthState);
    persist({ ...current, ...next });
  },

  login: async (email: string, password: string) => {
    if (get().loading) return;
    set({ loading: true, error: undefined });
    try {
      const base = getApiBaseUrl(); // '/proxy/api/v1'
      const res = await fetch(`${base}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || '로그인 실패');
      }
      const data: LoginResponse = await res.json();
      set({
        memberId: data.memberId,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        isLoggedIn: true,
        loading: false,
        error: undefined,
      });

      // 저장 (새로고침 유지)
      persist({
        memberId: data.memberId,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        // 로그인 시점에는 프로필을 아직 모를 수 있으므로 보존
        email: get().email,
        name: get().name,
        nickname: get().nickname,
        provider: get().provider,
      });
      // 기존 authFetch 재사용 위해 oauthTokens 포맷에도 저장
      saveTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });

      // 쿠키 (선택: 간단히 세션 용). 만료 시간은 1일.
      if (typeof document !== 'undefined') {
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toUTCString();
        document.cookie = `accessToken=${data.accessToken}; path=/; expires=${expires}`;
        document.cookie = `refreshToken=${data.refreshToken}; path=/; expires=${expires}`;
      }
    } catch (e: any) {
      set({ error: e.message || '로그인 에러', loading: false, isLoggedIn: false });
    }
  },

  logout: () => {
    set({
      memberId: undefined,
      accessToken: undefined,
      refreshToken: undefined,
      email: undefined,
      name: undefined,
      nickname: undefined,
      provider: undefined,
      isLoggedIn: false,
    });
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      // oauthTokens 제거
      clearTokens();
      // 쿠키 제거
      document.cookie = 'accessToken=; Max-Age=0; path=/';
      document.cookie = 'refreshToken=; Max-Age=0; path=/';
    }
  },
}));

// 초기 로드 시 1회 복원 (클라이언트에서만)
if (typeof window !== 'undefined') {
  // 약간의 지연 후 hydrate (Next.js hydration 경고 방지)
  setTimeout(() => {
    try {
      useAuthStore.getState().hydrate();
    } catch {}
  }, 0);
}

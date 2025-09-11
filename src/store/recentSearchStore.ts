import { create } from 'zustand';

interface RecentSearchState {
  recent: string[];
  setRecent: (items: string[]) => void;
  setRecentEphemeral: (items: string[]) => void; // 서버 전용 (localStorage 미저장)
  addKeyword: (keyword: string) => void;
  removeKeyword: (keyword: string) => void;
  clearAll: () => void;
}

export const RECENT_KEY = 'recentSearches';
export const useRecentSearchStore = create<RecentSearchState>((set) => ({
  recent: [],

  setRecent: (items) => {
    set({ recent: items });
    if (typeof window !== 'undefined') {
      localStorage.setItem(RECENT_KEY, JSON.stringify(items));
    }
  },
  setRecentEphemeral: (items) => {
    // localStorage 저장 없이 상태만 갱신
    set({ recent: items });
  },

  addKeyword: (keyword) =>
    set((state) => {
      const updated = [keyword, ...state.recent.filter((x) => x !== keyword)].slice(0, 10);
      if (typeof window !== 'undefined') {
        localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
      }
      return { recent: updated };
    }),

  removeKeyword: (keyword) =>
    set((state) => {
      const updated = state.recent.filter((x) => x !== keyword);
      if (typeof window !== 'undefined') {
        localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
      }
      return { recent: updated };
    }),
  clearAll: () => {
    set({ recent: [] });
    if (typeof window !== 'undefined') {
      localStorage.removeItem(RECENT_KEY);
    }
  },
}));

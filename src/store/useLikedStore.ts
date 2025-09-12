import { create } from 'zustand';

interface LikedStore {
  likedIds: Set<number>;
  toggle: (id: number) => void;
  isLiked: (id: number) => boolean;
  setAll: (ids: number[]) => void;
}

export const useLikedStore = create<LikedStore>((set, get) => ({
  likedIds: new Set(),
  toggle: (id) =>
    set((state) => {
      const newSet = new Set(state.likedIds);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return { likedIds: newSet };
    }),
  isLiked: (id) => get().likedIds.has(id),
  setAll: (ids) => set(() => ({ likedIds: new Set(ids) })),
}));

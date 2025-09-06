import { create } from 'zustand';

// 1️⃣ Zustand 스토어
type UnitType = '일마다' | '주마다' | '월마다';

interface DeliveryState {
  quickCycle: string | null;
  customUnit: UnitType;
  customCount: number;

  setQuickCycle: (cycle: string) => void;
  setCustomUnit: (unit: UnitType) => void;
  setCustomCount: (count: number) => void;
}

export const useDeliveryStore = create<DeliveryState>((set) => ({
  quickCycle: null,
  customUnit: '일마다',
  customCount: 1,

  setQuickCycle: (cycle) =>
    set({
      quickCycle: cycle,
      customCount: 1, // custom 초기화
      customUnit: '일마다', // custom 초기화
    }),
  setCustomUnit: (unit) =>
    set({
      customUnit: unit,
      quickCycle: null, // quickCycle 초기화
    }),
  setCustomCount: (count) =>
    set({
      customCount: count,
      quickCycle: null, // quickCycle 초기화
    }),
}));

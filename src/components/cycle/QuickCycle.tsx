import { useDeliveryStore } from '@/store/useDeliveryStore';

export default function QuickCycle() {
  const { quickCycle, setQuickCycle } = useDeliveryStore();
  const weekOptions = ['1주 마다', '2주 마다', '3주 마다', '4주 마다'];
  const monthOptions = ['1달', '2달', '3달'];

  return (
    <div className="border-b border-[var(--grey-100)] pb-8">
      <p className="mb-4 text-xl font-bold">빠른 주기 선택</p>

      <div className="mb-3.5 grid grid-cols-4 gap-2">
        {weekOptions.map((opt) => (
          <button
            key={opt}
            onClick={() => setQuickCycle(opt)}
            className={`rounded-[4px] border py-5 text-[13px] ${
              quickCycle === opt
                ? 'border-black bg-black text-white'
                : 'border-gray-300 bg-white text-gray-700'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {monthOptions.map((opt) => (
          <button
            key={opt}
            onClick={() => setQuickCycle(opt)}
            className={`rounded-[4px] border py-5 text-[13px] ${
              quickCycle === opt
                ? 'border-black bg-black text-white'
                : 'border-gray-300 bg-white text-gray-700'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

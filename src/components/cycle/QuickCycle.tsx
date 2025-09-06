import { useDeliveryStore } from '@/store/useDeliveryStore';

export default function QuickCycle() {
  const { quickCycle, setQuickCycle } = useDeliveryStore();
  const weekOptions = ['1주 마다', '2주 마다', '3주 마다', '4주 마다'];
  const monthOptions = ['1달', '2달', '3달'];

  return (
    <div className="border-b border-gray-200 pb-7">
      <p className="mb-3 text-xl font-bold">빠른 주기 선택</p>

      <div className="mb-4 grid grid-cols-4 gap-2">
        {weekOptions.map((opt) => (
          <button
            key={opt}
            onClick={() => setQuickCycle(opt)}
            className={`rounded-xs border py-5 text-sm ${
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
            className={`rounded-xs border py-5 text-sm ${
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

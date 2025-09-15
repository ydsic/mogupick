import { useDeliveryStore } from '@/store/useDeliveryStore';

type UnitType = '일마다' | '주마다' | '월마다';

export default function CustomCycle() {
  const { customUnit, customCount, quickCycle, setCustomUnit, setCustomCount } = useDeliveryStore();

  const options: UnitType[] = ['일마다', '주마다', '월마다'];

  const handleDecrease = () => {
    if (customCount > 1) setCustomCount(customCount - 1);
  };

  const displayText = quickCycle
    ? `${quickCycle} 한 번 배송됩니다.`
    : customUnit === '월마다'
      ? `${customCount}개월에 한 번 배송됩니다.`
      : `${customCount}${customUnit.replace('마다', '')}에 한 번 배송됩니다.`;
  return (
    <div className="mt-8">
      <p className="mb-4 text-xl font-bold">원하는 주기 선택</p>

      {/* 라디오 버튼 */}
      <div className="mb-4 flex items-center gap-4 text-sm">
        {options.map((option) => (
          <label key={option} className="flex cursor-pointer items-center">
            <span
              className={`mr-2 flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                customUnit === option ? 'border-[var(--green-500)]' : 'border-[var(--grey-200)]'
              }`}
            >
              {customUnit === option && (
                <span
                  className={`h-3 w-3 rounded-full ${customUnit === option ? 'bg-[var(--green-500)]' : 'bg-[var(--grey-200)]'}`}
                ></span>
              )}
            </span>
            <span
              className={`text-sm ${customUnit === option ? 'test-[var(--green-500)]' : 'text-[#c2c2c2]'} `}
            >
              {option}
            </span>
            <input
              type="radio"
              name="cycle"
              value={option}
              className="hidden"
              checked={customUnit === option}
              onChange={(e) => setCustomUnit(e.target.value as UnitType)}
            />
          </label>
        ))}
      </div>

      {/* 숫자 조절 */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center justify-center overflow-hidden">
          <button onClick={handleDecrease} className="h-9 w-9 bg-white text-xl">
            -
          </button>
          <span className="h-9 w-9 border-r border-l border-[#f8f8f8] bg-white text-center text-[13px] leading-9">
            {customCount}
          </span>
          <button
            onClick={() => setCustomCount(customCount + 1)}
            className="h-9 w-9 bg-white text-lg"
          >
            +
          </button>
        </div>
      </div>

      {/* 안내문구 */}
      <p className="rounded-xs bg-green-50 px-2 py-3 text-center text-base font-medium text-[var(--green-700)]">
        {displayText}
      </p>
    </div>
  );
}

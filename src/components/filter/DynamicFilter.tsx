import { FilterGroup, FilterValue } from '@/api/filters';

interface DynamicFilterProps {
  filterGroup: FilterGroup;
  selectedValues: string[];
  onFilterChange: (key: string, values: string[]) => void;
}

export function DynamicFilter({ filterGroup, selectedValues, onFilterChange }: DynamicFilterProps) {
  const { option, optionFilters } = filterGroup;

  // 가격범위와 별점은 단일 선택, 나머지는 다중 선택
  const isSingleSelect = option.key === 'PRICE' || option.key === 'RATING';

  const handleValueToggle = (value: FilterValue) => {
    if (isSingleSelect) {
      // 단일 선택: 같은 값이면 해제, 다른 값이면 교체
      const newValues = selectedValues.includes(value.expression) ? [] : [value.expression];
      onFilterChange(option.key, newValues);
    } else {
      // 다중 선택: 토글
      const newValues = selectedValues.includes(value.expression)
        ? selectedValues.filter((v) => v !== value.expression)
        : [...selectedValues, value.expression];
      onFilterChange(option.key, newValues);
    }
  };

  const handleRemoveValue = (expression: string) => {
    const newValues = selectedValues.filter((v) => v !== expression);
    onFilterChange(option.key, newValues);
  };

  // 가격범위와 별점은 라디오 버튼 형태로 렌더링
  const renderRadioFilter = () => (
    <div className="flex w-full flex-col items-start justify-start gap-5 px-4">
      {optionFilters.map((filterValue) => {
        const isSelected = selectedValues.includes(filterValue.expression);

        return (
          <button
            key={filterValue.expression}
            type="button"
            onClick={() => handleValueToggle(filterValue)}
            className="inline-flex h-4 items-center justify-start gap-2"
          >
            <div className="relative h-4 w-4 overflow-hidden">
              <div className="absolute top-[1px] left-[1px] h-3.5 w-3.5 rounded-full bg-white" />
              <div
                className={`absolute top-0 left-0 h-4 w-4 rounded-full border-2 ${
                  isSelected ? 'border-green-600 bg-green-600' : 'border-zinc-200 bg-zinc-200'
                }`}
              />
              {isSelected && (
                <div className="absolute top-[3px] left-[3px] h-2.5 w-2.5 rounded-full bg-white" />
              )}
            </div>
            <div className="text-sm font-medium text-zinc-900">{filterValue.name}</div>
          </button>
        );
      })}
    </div>
  );

  // 나머지 필터는 칩 형태로 렌더링
  const renderChipFilter = () => {
    // 옵션들을 4개씩 그룹으로 나누기
    const groupedOptions: FilterValue[][] = [];
    for (let i = 0; i < optionFilters.length; i += 4) {
      groupedOptions.push(optionFilters.slice(i, i + 4));
    }

    return (
      <div className="inline-flex flex-col items-start justify-start self-stretch">
        <div className="flex w-full flex-col items-start justify-start">
          {groupedOptions.map((group, groupIndex) => (
            <div
              key={groupIndex}
              className="inline-flex items-start justify-start gap-1 self-stretch px-4 py-1"
            >
              {group.map((filterValue) => {
                const isSelected = selectedValues.includes(filterValue.expression);

                return (
                  <button
                    key={filterValue.expression}
                    type="button"
                    onClick={() => handleValueToggle(filterValue)}
                    className={`flex h-8 items-center justify-center gap-1 rounded border border-solid px-3 py-2 ${
                      isSelected ? 'border-green-500 bg-green-50' : 'border-zinc-300 bg-white'
                    }`}
                  >
                    <div
                      className={`text-center text-xs leading-none font-normal ${
                        isSelected ? 'text-green-700' : 'text-zinc-900'
                      }`}
                    >
                      {filterValue.name}
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 선택된 값들을 칩 형태로 표시
  const renderSelectedChips = () => {
    if (selectedValues.length === 0) return null;

    const selectedOptions = optionFilters.filter((opt) => selectedValues.includes(opt.expression));

    return (
      <div className="inline-flex flex-wrap items-center justify-start gap-1 self-stretch bg-zinc-50 px-4 py-3">
        {selectedOptions.map((filterValue) => (
          <div
            key={filterValue.expression}
            className="flex h-7 items-center justify-center gap-1 rounded-[999px] border border-zinc-200 bg-zinc-200 p-2"
          >
            <div className="text-center text-xs leading-none font-normal text-zinc-900">
              {filterValue.name}
            </div>
            <button
              type="button"
              onClick={() => handleRemoveValue(filterValue.expression)}
              className="relative flex h-4 w-4 items-center justify-center overflow-hidden"
            >
              <svg className="h-3 w-3 text-zinc-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full py-4">{isSingleSelect ? renderRadioFilter() : renderChipFilter()}</div>
  );
}

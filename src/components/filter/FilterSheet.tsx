import { useEffect, useRef, useState } from 'react';
import { FilterGroup } from '@/api/filters';
import { FilterState } from './types';
import { useDragSheet } from './useDragSheet';
import { FilterTabs } from './FilterTabs';
import { DynamicFilter } from './DynamicFilter';

interface FilterSheetProps {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  filterGroups: FilterGroup[];
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  productCount?: number;
}

export function FilterSheet({
  open,
  onOpenChange,
  filterGroups,
  filters,
  onChange,
  productCount = 0,
}: FilterSheetProps) {
  const sheetRef = useRef<HTMLElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);
  const [activeTab, setActiveTab] = useState<FilterGroup | null>(filterGroups[0] || null);

  const { dragY, draggingRef, isValidDragStart, onPointerDown, onPointerMove, onPointerUp } =
    useDragSheet();

  useEffect(() => setLocalFilters(filters), [filters]);
  useEffect(() => {
    if (filterGroups.length > 0 && !activeTab) {
      setActiveTab(filterGroups[0]);
    }
  }, [filterGroups, activeTab]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false);
    };
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onOpenChange]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!open) return;
    if (!isValidDragStart(e.target, handleRef, headerRef, sheetRef, scrollAreaRef)) return;
    onPointerDown(e, sheetRef);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    onPointerMove(e);
  };

  const handlePointerUp = () => {
    onPointerUp(sheetRef, () => onOpenChange(false));
  };

  const handleFilterChange = (key: string, values: string[]) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: values,
    }));
  };

  const renderTabContent = () => {
    if (!activeTab) {
      return (
        <div className="w-full px-4 py-8">
          <div className="text-center text-zinc-500">필터 로딩중...</div>
        </div>
      );
    }

    return (
      <DynamicFilter
        filterGroup={activeTab}
        selectedValues={localFilters[activeTab.option.key] || []}
        onFilterChange={handleFilterChange}
      />
    );
  };

  const handleReset = () => {
    const resetFilters: FilterState = {};
    filterGroups.forEach((group) => {
      resetFilters[group.option.key] = [];
    });
    setLocalFilters(resetFilters);
  };

  const handleApply = () => {
    onChange(localFilters);
    onOpenChange(false);
  };

  if (filterGroups.length === 0) {
    return null;
  }

  return (
    <>
      <div
        onClick={() => onOpenChange(false)}
        className={`fixed inset-0 z-[60] bg-black/15 ${open ? '' : 'hidden'}`}
      />

      <section
        ref={sheetRef as any}
        role="dialog"
        aria-modal="true"
        aria-labelledby="filterSheetTitle"
        className={`fixed inset-x-0 bottom-0 z-[70] mx-auto w-full max-w-screen-sm rounded-t-2xl bg-white shadow-[0_-8px_24px_rgba(0,0,0,0.1)] will-change-transform ${
          open ? '' : 'translate-y-full'
        }`}
        style={{
          paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)',
          transform: open ? `translateY(${dragY}px)` : undefined,
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div ref={handleRef} className="flex touch-none items-center justify-center py-2">
          <span className="h-1.5 w-12 rounded-full bg-zinc-200" />
        </div>

        <FilterTabs tabs={filterGroups} activeTab={activeTab} onTabChange={setActiveTab} />

        <div ref={scrollAreaRef} className="h-60 overflow-y-auto">
          {renderTabContent()}
        </div>

        {/* 선택된 필터들을 표시하는 영역 */}
        {Object.values(localFilters).some((values) => values && values.length > 0) && (
          <div className="border-t border-zinc-200">
            <div className="bg-zinc-50 px-4 py-3">
              <div className="mb-2 text-sm font-medium text-zinc-900">선택된 필터</div>
              <div className="flex flex-wrap gap-1">
                {filterGroups.map((group) => {
                  const selectedValues = localFilters[group.option.key] || [];
                  if (selectedValues.length === 0) return null;

                  return selectedValues.map((value) => {
                    const filterOption = group.optionFilters.find(
                      (opt) => opt.expression === value,
                    );
                    if (!filterOption) return null;

                    return (
                      <div
                        key={`${group.option.key}-${value}`}
                        className="flex h-7 items-center gap-1 rounded-full border border-zinc-300 bg-white px-2 py-1"
                      >
                        <span className="text-xs text-zinc-700">{filterOption.name}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const newValues = selectedValues.filter((v) => v !== value);
                            setLocalFilters((prev) => ({
                              ...prev,
                              [group.option.key]: newValues,
                            }));
                          }}
                          className="flex h-3 w-3 items-center justify-center"
                        >
                          <svg
                            className="h-2 w-2 text-zinc-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    );
                  });
                })}
              </div>
            </div>
          </div>
        )}

        <div className="mt-auto flex flex-col items-center justify-end gap-3 self-stretch">
          <div className="flex w-full flex-col items-center justify-start gap-2 bg-white">
            <div className="inline-flex items-start justify-start gap-2.5 self-stretch px-4 py-3">
              <button
                type="button"
                className="flex h-12 w-28 items-center justify-center gap-1 rounded border border-zinc-300 bg-white px-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/50"
                onClick={handleReset}
              >
                <div className="text-base font-medium text-zinc-900">초기화</div>
              </button>
              <button
                type="button"
                className="flex h-12 flex-1 items-center justify-center gap-1 rounded bg-black px-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/50"
                onClick={handleApply}
              >
                <div className="text-base font-medium text-white">{productCount}개의 상품보기</div>
              </button>
            </div>
            <div className="flex h-5 flex-col items-center justify-center gap-2.5 self-stretch py-2">
              <div className="h-[5px] w-36 rounded-[99px] bg-black"></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

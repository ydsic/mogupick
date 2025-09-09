import { FilterGroup } from '@/api/filters';

interface TabButtonProps {
  tab: FilterGroup;
  isActive: boolean;
  onTabChange: (tab: FilterGroup) => void;
}

export function TabButton({ tab, isActive, onTabChange }: TabButtonProps) {
  return (
    <button
      type="button"
      onClick={() => onTabChange(tab)}
      className="inline-flex min-w-fit flex-shrink-0 flex-col items-center justify-start gap-3.5 border-b border-zinc-300 px-4 pt-3 pb-3 whitespace-nowrap"
    >
      <div className="flex flex-col items-center justify-start gap-3.5">
        <div
          className={`text-center text-base font-medium ${
            isActive ? 'font-semibold text-green-600' : 'text-zinc-500'
          }`}
        >
          {tab.option.name}
        </div>
        <div className={`h-0.5 w-full ${isActive ? 'bg-green-600' : ''}`} />
      </div>
    </button>
  );
}

interface FilterTabsProps {
  tabs: FilterGroup[];
  activeTab: FilterGroup | null;
  onTabChange: (tab: FilterGroup) => void;
}

export function FilterTabs({ tabs, activeTab, onTabChange }: FilterTabsProps) {
  return (
    <div className="flex flex-col items-start justify-start gap-2.5 self-stretch">
      <div className="w-full overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="inline-flex items-center justify-start bg-white">
          {tabs.map((tab) => (
            <TabButton
              key={tab.option.key}
              tab={tab}
              isActive={activeTab?.option.key === tab.option.key}
              onTabChange={onTabChange}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

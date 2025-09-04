// 제네릭 탭 컴포넌트
interface TabsProps<T extends string> {
  activeTab: T;
  onChange: (tab: T) => void;
  tabs: { key: T; label: string }[];
}

export default function Tabs<T extends string>({ activeTab, onChange, tabs }: TabsProps<T>) {
  return (
    <div className="flex border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={`flex-1 py-2 text-center ${
            activeTab === tab.key ? 'border-b-2 border-black font-bold' : 'text-gray-400'
          }`}
          onClick={() => onChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

interface TabsProps {
  activeTab: 'list' | 'calendar';
  onChange: (tab: 'list' | 'calendar') => void;
}

export default function Tabs({ activeTab, onChange }: TabsProps) {
  return (
    <div className="flex border-b border-gray-200">
      <button
        className={`flex-1 py-2 text-center font-bold ${
          activeTab === 'list' ? 'border-b-2 border-black' : 'text-gray-400'
        }`}
        onClick={() => onChange('list')}
      >
        구독리스트
      </button>
      <button
        className={`flex-1 py-2 text-center ${
          activeTab === 'calendar' ? 'border-b-2 border-black font-bold' : 'text-gray-400'
        }`}
        onClick={() => onChange('calendar')}
      >
        구독캘린더
      </button>
    </div>
  );
}

import React from 'react';

interface TabListProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tabs: { id: string; label: string }[];
}

const TabList = ({ activeTab, setActiveTab, tabs }: TabListProps) => {
  return (
    <div className="w-1/4 rounded-lg bg-secondaryBg p-4">
      <h2 className="mb-4 text-2xl font-bold text-primaryFont">Profile</h2>
      <ul>
        {tabs.map((tab) => (
          <li key={tab.id}>
            <button
              onClick={() => setActiveTab(tab.id)}
              className={`block w-full rounded px-4 py-2 text-left mt-2 ${
                activeTab === tab.id ? "bg-highlightBg text-accentFont" : "text-primaryFont"
              }`}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TabList;

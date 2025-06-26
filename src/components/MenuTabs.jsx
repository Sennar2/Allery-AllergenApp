// src/components/MenuTabs.jsx
import React from "react";

export default function MenuTabs({ selectedTab, setTab }) {
  return (
    <div className="flex justify-center border-b border-gray-300 mb-4">
      {["Food", "Drinks"].map((tab) => (
        <button
          key={tab}
          onClick={() => setTab(tab)}
          className={`px-4 py-2 text-lg font-medium ${
            selectedTab === tab
              ? "text-teal-700 border-b-4 border-teal-500"
              : "text-gray-500"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

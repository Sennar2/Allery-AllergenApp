// src/components/LocationSelector.jsx
import React from "react";

const locations = ["La Mia Mamma – Chelsea", "La Mia Mamma – Notting Hill"];

export default function LocationSelector({ onSelect }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4 px-4">
      <img src="/logo192.png" alt="SafeBite Logo" className="w-16 h-16" />
      <h2 className="text-xl font-semibold text-gray-800">Select Location</h2>
      {locations.map((loc) => (
        <button
          key={loc}
          onClick={() => onSelect(loc)}
          className="bg-white border border-gray-300 px-6 py-2 rounded-full text-blue-800 shadow hover:bg-gray-50 transition"
        >
          {loc}
        </button>
      ))}
    </div>
  );
}

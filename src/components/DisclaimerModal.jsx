// src/components/DisclaimerModal.jsx
import React from "react";

export default function DisclaimerModal({ onAccept }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-semibold text-blue-900 mb-4">Welcome to Allerly UK</h1>
        <p className="text-gray-700 text-sm mb-4">
          Please note that allergen information is based on available data and may not be completely accurate. Always ask your server.
        </p>
        <p className="text-gray-700 text-sm mb-6">
          By using this app, it is a declaration you accept this information.
        </p>
        <button
          onClick={onAccept}
          className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-full transition"
        >
          I Accept
        </button>
      </div>
    </div>
  );
}

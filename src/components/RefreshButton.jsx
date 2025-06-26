import React from "react";

function RefreshButton({ onRefresh }) {
  return (
    <button
      onClick={onRefresh}
      className="px-4 py-2 rounded-lg bg-red-500 text-white shadow hover:bg-red-600 transition"
    >
      🔄 Restart
    </button>
  );
}

export default RefreshButton;

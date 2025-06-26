// src/components/SearchBar.jsx
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

const SearchBar = ({ search, setSearch, compact = false }) => {
  const [showInput, setShowInput] = useState(!compact);

  const handleToggle = () => {
    setShowInput((prev) => !prev);
  };

  return (
    <div className="text-center">
      {compact && !showInput ? (
        <button
          onClick={handleToggle}
          className="text-gray-600 hover:text-green-700 text-xl"
          aria-label="Search"
        >
          <FaSearch />
        </button>
      ) : (
        <div className="px-4 pb-3 w-full flex justify-center">
          <input
            type="text"
            placeholder="Search dishes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onBlur={() => compact && setTimeout(() => setShowInput(false), 200)} // Optional auto-hide
            className="w-full max-w-md px-4 py-2 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring focus:ring-green-200"
          />
        </div>
      )}
    </div>
  );
};

export default SearchBar;

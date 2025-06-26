import React from "react";

const ALLERGENS = [
  "Dairy", "Eggs", "Nuts", "Peanuts", "Gluten", "Soy",
  "Fish", "Crustaceans", "Molluscs", "Celery", "Mustard",
  "Sesame", "Lupin", "Sulphites",
];

const DIETARY = [
  "Vegan", "Vegetarian", "GlutenFree", "NutFree", "DairyFree", "LowSugar", "Halal"
];

const getIcon = (tag) => {
  const icons = {
    dairy: "🥛", eggs: "🥚", nuts: "🥜", peanuts: "🥜",
    gluten: "🌾", soy: "🌱", fish: "🐟", crustaceans: "🦐",
    molluscs: "🐚", celery: "🥬", mustard: "🌿", sesame: "⚪",
    lupin: "🌸", sulphites: "💨",
    vegan: "🌱", vegetarian: "🥕", glutenfree: "🚫🌾",
    nutfree: "🚫🥜", dairyfree: "🚫🥛", lowsugar: "🍬❌"
    // Halal intentionally has no icon
  };
  return icons[tag.toLowerCase()] || "";
};

const toKey = (str) => str.toLowerCase().replace(/\s+/g, "");

const FilterPanel = ({ filters, setFilters, showHidden, setShowHidden }) => {
  const toggleTag = (tag) => {
    setFilters((prev) => ({
      ...prev,
      [tag]: !prev[tag],
    }));
  };

  return (
    <div className="px-4 mt-4">
      <div className="border border-gray-200 rounded-xl p-6 shadow-sm bg-white">
        {/* Allergen Filters */}
        <div className="mb-5 text-center">
          <p className="font-semibold text-lg text-red-700 mb-3">
            ⚠️ Allergen Filters
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {ALLERGENS.map((tag) => {
              const key = toKey(tag);
              return (
                <button
                  key={key}
                  onClick={() => toggleTag(key)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    filters[key]
                      ? "bg-red-600 text-white"
                      : "bg-red-100 text-red-700 hover:bg-red-200"
                  }`}
                >
                  {getIcon(key)} {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dietary Preferences */}
        <div className="mb-5 text-center">
          <p className="font-semibold text-lg text-green-700 mb-3">
            🥦 Dietary Preferences
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {DIETARY.map((tag) => {
              const key = toKey(tag);
              return (
                <button
                  key={key}
                  onClick={() => toggleTag(key)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    filters[key]
                      ? "bg-green-600 text-white"
                      : "bg-green-100 text-green-700 hover:bg-green-200"
                  }`}
                >
                  {getIcon(key)} {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Show Hidden */}
        <div className="text-center">
          <button
            onClick={() => setShowHidden(!showHidden)}
            className={`px-4 py-2 text-sm rounded-full border transition font-medium ${
              showHidden
                ? "bg-gray-800 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {showHidden ? "✔ Showing Hidden" : "Show Hidden Results"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;

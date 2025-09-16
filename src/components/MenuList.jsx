import React from "react";

// Utility: Title case any string
const toTitleCase = (str) =>
  str
    ?.toLowerCase()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

// Utility: Clean and split a tag string (e.g., "Milk, Eggs")
function normalizeTags(tagString = "") {
  return tagString
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);
}

// Extract dietary tags from item object
function getDietaryTags(item) {
  const tags = [];
  if (item.Vegan?.toLowerCase() === "yes") tags.push("vegan");
  if (item.Vegetarian?.toLowerCase() === "yes") tags.push("vegetarian");
  if (
    item["Gluten-Free"]?.toLowerCase() === "yes" ||
    item.GlutenFree?.toLowerCase() === "yes"
  )
    tags.push("glutenfree");
  if (item.Halal?.toLowerCase() === "yes") tags.push("halal");

  // ✅ NEW OPTIONS
  if (item["Vegan Available"]?.toLowerCase() === "yes") tags.push("veganavailable");
  if (item["Gluten Free Available"]?.toLowerCase() === "yes")
    tags.push("glutenfreeavailable");

  return tags;
}

// Determine if item passes active filters
function matchesFilters(item, filters) {
  const allergens = normalizeTags(item["Allergen Tags"]);
  const dietary = getDietaryTags(item);

  for (const tag of Object.keys(filters)) {
    if (!filters[tag]) continue;

    const tagLower = tag.toLowerCase();

    // Exclude allergens
    if (allergens.includes(tagLower)) return false;

    // ✅ Include new dietary filters
    const isDietary = [
      "vegan",
      "vegetarian",
      "glutenfree",
      "halal",
      "veganavailable",
      "glutenfreeavailable",
    ];
    if (isDietary.includes(tagLower) && !dietary.includes(tagLower)) {
      return false;
    }
  }

  return true;
}

// Allergen icons
function getAllergenIcon(tag) {
  const icons = {
    dairy: "🥛",
    eggs: "🥚",
    nuts: "🥜",
    peanuts: "🥜",
    gluten: "🌾",
    soy: "🌱",
    fish: "🐟",
    crustaceans: "🦐",
    molluscs: "🐚",
    celery: "🥬",
    mustard: "🌿",
    sesame: "⚪",
    lupin: "🌸",
    sulphites: "💨",
  };
  return icons[tag.toLowerCase()] || "❗";
}

// Dietary icons
function getDietaryIcon(tag) {
  const icons = {
    vegan: "🌱",
    vegetarian: "🥕",
    glutenfree: "🚫🌾",
    halal: "🕌",
    veganavailable: "🌱✅", // ✅ new
    glutenfreeavailable: "🌾✅", // ✅ new
  };
  return icons[tag.toLowerCase()] || "✅";
}

const MenuList = ({ items = [], filters = {}, search = "", showHidden }) => {
  const grouped = {};

  // Group dishes by category
  items.forEach((item) => {
    const cat = toTitleCase(item.Category || "Uncategorized");
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(item);
  });

  return (
    <div className="px-4 py-6 space-y-8">
      {Object.entries(grouped).map(([category, dishes]) => {
        const visibleDishes = dishes
          .map((item) => {
            const nameMatch = item["Dish Name"]
              ?.toLowerCase()
              .includes(search.toLowerCase());

            const passesFilter = matchesFilters(item, filters);
            const shouldShow = nameMatch && (passesFilter || showHidden);

            return {
              ...item,
              hidden: !passesFilter,
              _visible: shouldShow,
            };
          })
          .filter((item) => item._visible);

        if (visibleDishes.length === 0) return null;

        return (
          <div key={category}>
            <h2 className="text-xl font-semibold mb-2 text-green-700 text-center">
              {category}
            </h2>
            <ul className="space-y-4">
              {visibleDishes.map((item, index) => (
                <li
                  key={index}
                  className={`p-4 border rounded-lg shadow-sm bg-white ${
                    item.hidden ? "opacity-40" : ""
                  }`}
                >
                  <h3 className="font-bold text-lg text-gray-800">
                    {item["Dish Name"]}
                  </h3>

                  {/* Dish Description */}
                  {item.Description && (
                    <p className="text-sm text-gray-600 mt-1 italic">
                      {item.Description}
                    </p>
                  )}

                  {/* Ingredients */}
                  {item.Ingredients && (
                    <p className="text-sm text-gray-700 mt-1">
                      {item.Ingredients}
                    </p>
                  )}

                  {/* Notes */}
                  {item.Notes && (
                    <p className="italic text-xs text-gray-500 mt-1">
                      {item.Notes}
                    </p>
                  )}

                  {/* Allergen Tags */}
                  {normalizeTags(item["Allergen Tags"]).length > 0 && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-red-700">
                      <span className="font-semibold">⚠️ Allergens:</span>
                      <div className="flex flex-wrap gap-2">
                        {normalizeTags(item["Allergen Tags"]).map((a, i) => (
                          <span
                            key={`allergen-${i}`}
                            className="bg-red-100 px-2 py-1 rounded-full"
                          >
                            {getAllergenIcon(a)} {toTitleCase(a)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Dietary Tags */}
                  {getDietaryTags(item).length > 0 && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-green-700">
                      <span className="font-semibold">Dietary:</span>
                      <div className="flex flex-wrap gap-2">
                        {getDietaryTags(item).map((d, i) => (
                          <span
                            key={`dietary-${i}`}
                            className="bg-green-100 px-2 py-1 rounded-full"
                          >
                            {getDietaryIcon(d)} {toTitleCase(d)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
};

export default MenuList;

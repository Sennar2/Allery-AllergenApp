// src/pages/App.jsx
import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import SearchBar from "../components/SearchBar";
import FilterPanel from "../components/FilterPanel";
import MenuList from "../components/MenuList";
import QRCodeGenerator from "../components/QRCodeGenerator";
import RefreshButton from "../components/RefreshButton";
import Footer from "../components/Footer";
import { FaSearch } from "react-icons/fa";

// Helper: Capitalize Each Word
const toTitleCase = (str) =>
  str
    ?.toLowerCase()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

const CONFIG_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vShydY4mFLVb8956vc5-7bIpGKd0iVG85JkiQ_wt3uLgvWRZabzpiU0vSIsdG24Jp16-zz9vfPb2gfv/pub?output=csv";

function App() {
  const [menu, setMenu] = useState([]);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [filters, setFilters] = useState({});
  const [showHidden, setShowHidden] = useState(false);
  const [location, setLocation] = useState("");
  const [locations, setLocations] = useState([]);
  const [accepted, setAccepted] = useState(false);
  const [tab, setTab] = useState("food");

  const [logos, setLogos] = useState({});
  const [sheetBaseUrls, setSheetBaseUrls] = useState({});
  const [tabGids, setTabGids] = useState({});

  // Load config
  useEffect(() => {
    Papa.parse(CONFIG_URL, {
      download: true,
      header: true,
      complete: (results) => {
        const locs = [];
        const logoMap = {};
        const sheetMap = {};
        const gidMap = {};

        results.data.forEach((row) => {
          const loc = row.location?.trim().toLowerCase();
          if (loc) {
            locs.push(loc);
            logoMap[loc] = row.logo_url?.trim();
            sheetMap[loc] = row.sheet_base_url?.trim();
            gidMap[loc] = {
              food: row.food_gid?.trim(),
              drinks: row.drinks_gid?.trim(),
              other: row.other_gid?.trim(),
            };
          }
        });

        setLocations(locs);
        setLogos(logoMap);
        setSheetBaseUrls(sheetMap);
        setTabGids(gidMap);

        if (!location && locs.length > 0) {
          setLocation(locs[0]);
        }
      },
    });
  }, []);

  // Load menu
  useEffect(() => {
    if (!location || !sheetBaseUrls[location] || !tabGids[location]?.[tab]) return;

    const sheetUrl = `${sheetBaseUrls[location]}&gid=${tabGids[location][tab]}`;

    Papa.parse(sheetUrl, {
      download: true,
      header: true,
      complete: (results) => {
        const items = results.data.filter((row) => row["Dish Name"]);
        setMenu(items);
      },
    });
  }, [location, tab, sheetBaseUrls, tabGids]);

  const logoToShow =
    logos[location] && logos[location].startsWith("http")
      ? logos[location]
      : "/logos/safebite.png";

  if (!accepted) {
    return (
      <div className="h-screen flex items-center justify-center bg-white px-4 text-center">
        <div>
          <img
            src="/logos/safebite.png"
            alt="SafeBite"
            className="mx-auto h-20 mb-4"
          />
          <p className="mb-4 text-gray-700 text-lg max-w-lg">
            Welcome to SafeBite. Confirm to proceed to your menu.
          </p>
          <button
            onClick={() => setAccepted(true)}
            className="px-5 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700"
          >
            Let's Go
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b py-4 shadow-sm text-center">
        <img
          src={logoToShow}
          alt="Logo"
          className="h-16 mx-auto object-contain mb-4"
        />
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="px-3 py-1 border rounded-md shadow-sm"
        >
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {toTitleCase(loc)}
            </option>
          ))}
        </select>
      </header>

      {/* Tabs + Search Icon */}
      <div className="flex items-center justify-center gap-3 py-5 text-sm font-medium">
        {["food", "drinks", "other"].map((key) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-full transition ${
              tab === key
                ? "bg-green-600 text-white"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            {toTitleCase(key)}
          </button>
        ))}
        <button
          onClick={() => setShowSearch((prev) => !prev)}
          className="text-gray-600 text-xl hover:text-green-600"
          aria-label="Toggle search"
        >
          <FaSearch />
        </button>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="px-4 mb-4">
          <SearchBar search={search} setSearch={setSearch} />
        </div>
      )}

      {/* Filter Panel */}
      <FilterPanel
        filters={filters}
        setFilters={setFilters}
        showHidden={showHidden}
        setShowHidden={setShowHidden}
      />

      {/* Menu */}
      <MenuList
        items={menu}
        filters={filters}
        search={search}
        showHidden={showHidden}
      />

      {/* Actions */}
      <div className="flex justify-center gap-4 p-4">
        <QRCodeGenerator />
        <RefreshButton onClick={() => setAccepted(false)} />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;

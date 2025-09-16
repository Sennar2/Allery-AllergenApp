
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

const MASTER_CONFIG_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTXJDtz0TP8191ExwSFKcp8Jqsrd43dUROfFLzKEjSDPKlcnGx4GT0BMO6IjA3DpL4O6yzo60p8492M/pub?output=csv";

function getSubdomain() {
  const host = window.location.hostname;
  const parts = host.split(".");
  return parts.length > 2 ? parts[0].toLowerCase().trim() : "default";
}

const toTitleCase = (str) =>
  str?.toLowerCase()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

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
  const [configUrl, setConfigUrl] = useState("");

  const subdomain = getSubdomain();
  console.log("🔍 Detected subdomain:", subdomain);

  useEffect(() => {
    Papa.parse(MASTER_CONFIG_URL, {
      download: true,
      header: true,
      complete: (results) => {
        console.log("📄 Raw tenant config data:", results.data);

        const cleaned = results.data.map(row => ({
          subdomain: row.subdomain?.trim().toLowerCase(),
          config_url: row.config_url?.trim(),
          company_name: row.company_name?.trim()
        }));

        console.log("🧼 Normalized tenant list:", cleaned);

        const match = cleaned.find(row => row.subdomain === subdomain);

        if (!match) {
          console.error("❌ No matching subdomain found for:", subdomain);
          alert(`No config found for subdomain: ${subdomain}`);
          return;
        }

        console.log("✅ Matched tenant:", match);
        setConfigUrl(match.config_url);
      }
    });
  }, [subdomain]);

  useEffect(() => {
    if (!configUrl) return;

    Papa.parse(configUrl, {
      download: true,
      header: true,
      complete: (results) => {
        console.log("📦 Loaded tenant config sheet:", results.data);

        const locs = [];
        const logoMap = {};
        const sheetMap = {};
        const gidMap = {};

        results.data.forEach((row) => {
          const loc = row.location?.trim().toLowerCase();
          if (!loc) return;

          locs.push(loc);
          logoMap[loc] = row.logo_url?.trim();
          sheetMap[loc] = row.sheet_base_url?.trim();
          gidMap[loc] = {
            food: row.food_gid?.trim(),
            drinks: row.drinks_gid?.trim(),
            other: row.other_gid?.trim(),
          };
        });

        console.log("📍 Locations:", locs);
        setLocations(locs);
        setLogos(logoMap);
        setSheetBaseUrls(sheetMap);
        setTabGids(gidMap);

        if (!location && locs.length > 0) {
          setLocation(locs[0]);
        }
      }
    });
  }, [configUrl]);

  useEffect(() => {
    if (!location || !sheetBaseUrls[location] || !tabGids[location]?.[tab]) return;

    const sheetUrl = `${sheetBaseUrls[location]}&gid=${tabGids[location][tab]}`;
    console.log("📥 Fetching menu from:", sheetUrl);

    Papa.parse(sheetUrl, {
      download: true,
      header: true,
      complete: (results) => {
        const items = results.data.filter(row => row["Dish Name"]);
        console.log("🍽 Menu items:", items);
        setMenu(items);
      }
    });
  }, [location, tab, sheetBaseUrls, tabGids]);

  const logoToShow = logos[location]?.startsWith("http")
    ? logos[location]
    : "/logos/allerlylogo.png";

  if (!accepted) {
    return (
      <div className="h-screen flex items-center justify-center bg-white px-4 text-center">
        <div>
          <img src="/logos/allerlylogo.png" alt="Allerly" className="mx-auto h-20 mb-4" />
          <p className="mb-4 text-gray-700 text-lg max-w-lg">
            Welcome to Allerly. Could you please confirm that you would like to proceed to your menu? 
            Data provided by the venue might not be a reflection of a last-minute menu change. 
            Always check with your server.  
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
      <header className="bg-white border-b py-4 shadow-sm text-center">
        <img src={logoToShow} alt="Logo" className="h-16 mx-auto object-contain mb-4" />
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

      <div className="flex items-center justify-center gap-3 py-5 text-sm font-medium">
        {["food", "drinks", "other"].map((key) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-full transition ${
              tab === key ? "bg-green-600 text-white" : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            {toTitleCase(key)}
          </button>
        ))}
        <button
          onClick={() => setShowSearch(prev => !prev)}
          className="text-gray-600 text-xl hover:text-green-600"
          aria-label="Toggle search"
        >
          <FaSearch />
        </button>
      </div>

      {showSearch && (
        <div className="px-4 mb-4">
          <SearchBar search={search} setSearch={setSearch} />
        </div>
      )}

      <FilterPanel
        filters={filters}
        setFilters={setFilters}
        showHidden={showHidden}
        setShowHidden={setShowHidden}
      />

      <MenuList
        items={menu}
        filters={filters}
        search={search}
        showHidden={showHidden}
      />

      <div className="flex justify-center gap-4 p-4">
        <QRCodeGenerator />
        <RefreshButton onRefresh={() => window.location.href = "/"} />
      </div>

      <Footer />
    </div>
  );
}

export default App;

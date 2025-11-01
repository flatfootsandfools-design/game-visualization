import { createPortal } from "react-dom";
import { useState } from "react";
import GameMap from "./components/GameMap";
import GameInfoPanel from "./components/GameInfoPanel";
import { games } from "./data/games";

function App() {
  // 🧩 Selected game (for info panel)
  const [selectedGame, setSelectedGame] = useState(null);

  // 🧩 All filters
  const [filters, setFilters] = useState({
    releaseStatus: "All",
    demo: "All",
    free: "All",
    firstPersonMotion: "All",
    actionPressure: "All",
    audioRequired: "All",
    gameJam: "All",
  });
  const [showDeveloperLines, setShowDeveloperLines] = useState(true);
  const [showStudioLines, setShowStudioLines] = useState(true);

  // 🧩 Helper to get unique dropdown options
  const getUniqueOptions = (key) => {
    const values = [...new Set(games.map((g) => g[key]))];
    if (typeof values[0] === "boolean") return ["Yes", "No"];
    return values.filter((v) => v !== undefined && v !== null);
  };

  // 🧩 Filter games based on dropdowns
  const visibleGames = games.filter((g) =>
    Object.entries(filters).every(([key, value]) => {
      if (value === "All") return true;
      if (typeof g[key] === "boolean") {
        return (value === "Yes" && g[key]) || (value === "No" && !g[key]);
      }
      return g[key] === value;
    })
  );

  return (
    <div
      className="min-h-screen p-6"
      style={{
        backgroundColor: "#1c1b1a", // dark neutral background
        color: "#f4e7d3", // warm off-white text
      }}
    >
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
        Detecting Mechanics Visualization
      </h1>

      {/* 🧩 Filter Row */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        {[
          { key: "releaseStatus", label: "Release Status" },
          { key: "demo", label: "Demo Available" },
          { key: "free", label: "Free" },
          { key: "firstPersonMotion", label: "First Person Motion" },
          { key: "actionPressure", label: "Action / Time Pressure" },
          { key: "audioRequired", label: "Audio Required" },
          { key: "gameJam", label: "Game Jam" },
        ].map(({ key, label }) => (
          <div key={key} className="flex flex-col items-start text-sm">
            <label htmlFor={key} className="font-semibold text-gray-200 mb-1">
              {label}
            </label>
            <select
              id={key}
              value={filters[key]}
              onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}
              className="border border-gray-500 rounded-md px-2 py-1 bg-[#f7e9c7] text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="All">All</option>
              {getUniqueOptions(key).map((option) => (
                <option key={option} value={option}>
                  {String(option)}
                </option>
              ))}
            </select>
          </div>
        ))}
        {/* Reset Filters Button */}
        <div className="flex items-end">
          <button
            onClick={() =>
              setFilters({
                releaseStatus: "All",
                demo: "All",
                free: "All",
                firstPersonMotion: "All",
                actionPressure: "All",
                audioRequired: "All",
              })
            }
            className="ml-4 px-4 py-2 bg-[#b58b68] hover:bg-[#a47b5b] text-[#2e1e10] font-semibold rounded-lg shadow-md transition-colors duration-150 border border-[#8c6b4a]"
          >
            Reset All Filters
          </button>
        </div>
        {/* Connection Line Toggles */}
        <div className="flex justify-center gap-4 mb-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showDeveloperLines}
              onChange={(e) => setShowDeveloperLines(e.target.checked)}
              className="w-4 h-4 accent-blue-600"
            />
            <span className="text-sm">Show Developer Connections</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showStudioLines}
              onChange={(e) => setShowStudioLines(e.target.checked)}
              className="w-4 h-4 accent-green-600"
            />
            <span className="text-sm">Show Studio Connections</span>
          </label>
        </div>
      </div>

      {/* 🧩 Map Container */}
      <div
        className="relative mx-auto border-8 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] overflow-hidden"
        style={{
          borderColor: "#5e4630",
          width: "90%",
          maxWidth: "1200px",
          backgroundColor: "#b58b68",
          backgroundImage: `
            radial-gradient(#9c744e 1px, transparent 1px),
            radial-gradient(#a37b52 1px, transparent 1px)
          `,
          backgroundSize: "18px 18px",
          backgroundPosition: "0 0, 9px 9px",
        }}
      >
        <GameMap
          games={visibleGames}
          onSelect={setSelectedGame}
          showDeveloperLines={showDeveloperLines}
          showStudioLines={showStudioLines}
        />
      </div>

      {/* 🧩 Info Panel */}
      {createPortal(
        <GameInfoPanel
          game={selectedGame}
          onClose={() => setSelectedGame(null)}
        />,
        document.body
      )}
    </div>
  );
}

export default App;

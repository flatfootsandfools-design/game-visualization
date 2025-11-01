import { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

export default function GameMap({ games, onSelect, showDeveloperLines, showStudioLines }) {

  const svgRef = useRef();
  const gRef = useRef();
  const [positions, setPositions] = useState(
    games.reduce((acc, g) => ({ ...acc, [g.id]: { x: g.x, y: g.y } }), {})
  );
  const [editMode, setEditMode] = useState(false);

  // D3 Zoom & Pan
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const g = d3.select(gRef.current);

    const zoom = d3.zoom()
      .scaleExtent([0.2, 3])
      .on("zoom", (event) => g.attr("transform", event.transform));

    svg.call(zoom);
    svg.on("dblclick", () =>
      svg.transition().duration(500).call(zoom.transform, d3.zoomIdentity)
    );
  }, []);

// D3 Dragging
useEffect(() => {
  // ✅ Only enable drag if environment variable allows it
  const isEditModeEnabled = import.meta.env.VITE_EDIT_MODE === "true";
  if (!isEditModeEnabled || !editMode) return;

  const g = d3.select(gRef.current);

  const drag = d3.drag()
    .on("drag", function (event) {
      const id = d3.select(this).attr("data-id");
      const newX = event.x;
      const newY = event.y;

      d3.select(this).attr("transform", `translate(${newX}, ${newY})`);

      setPositions((prev) => ({
        ...prev,
        [id]: { x: newX, y: newY },
      }));
    })
    .on("end", function (event) {
      const id = d3.select(this).attr("data-id");
      const pos = positions[id];
      console.log(`Updated ${id}: x=${pos.x}, y=${pos.y}`);
    });

  g.selectAll(".game-node").call(drag);
}, [editMode, positions]);


  // --- 💾 EXPORT FUNCTION ---
  const handleExport = () => {
    const updatedGames = games.map((g) => ({
      ...g,
      x: positions[g.id].x,
      y: positions[g.id].y,
    }));

    const json = JSON.stringify(updatedGames, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "updated_games.json";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full h-[80vh] bg-gray-100 border rounded-lg overflow-hidden relative">
      {/* Edit Mode Toggle Button */}
      <button
        onClick={() => setEditMode(!editMode)}
        className={`absolute top-2 left-2 px-3 py-1 rounded text-sm z-10 ${
          editMode ? "bg-red-500 text-white" : "bg-gray-200 text-gray-700"
        }`}
      >
        {editMode ? "Editing (Drag ON)" : "View Mode"}
      </button>

      {/* Save Layout Button (only in edit mode) */}
      {editMode && (
        <button
          onClick={handleExport}
          className="absolute top-2 left-36 px-3 py-1 rounded text-sm bg-green-500 text-white z-10 hover:bg-green-600"
        >
          💾 Save Layout
        </button>
      )}

      <svg ref={svgRef} width="100%" height="100%">
        <g ref={gRef}>
          {/* Manila folder section for unclassified games */}
          <g className="Unplayed Games">
            <rect
              x={200}   // moved right
              y={700}   // moved down
              width={1200}  // tripled width
              height={750}  // tripled height
              rx={20}
              ry={20}
              fill="#f3e2b3"
              stroke="#d0b986"
              strokeWidth={4}
              filter="url(#folderShadow)"
            />
            <text
              x={800}   // centered horizontally
              y={740}   // placed above the rectangle
              textAnchor="middle"
              fontSize="28"
              fontWeight="bold"
              fill="#3b2e1d"
            >
              Unsorted Games
            </text>
          </g>

          {/* Connection lines between games (developer = blue, studio = green) */}
          {(() => {
            const lineOffset = 6; // spacing offset when both lines exist

            // helper to group, sort, and produce pairs
            const makeConnections = (games, key) => {
              const groups = games.reduce((acc, g) => {
                const val = g[key];
                if (!val) return acc;
                if (!acc[val]) acc[val] = [];
                acc[val].push(g);
                return acc;
              }, {});

              Object.values(groups).forEach((list) => {
                list.sort((a, b) => {
                  if (a.releaseStatus === "Released" && b.releaseStatus !== "Released") return -1;
                  if (a.releaseStatus !== "Released" && b.releaseStatus === "Released") return 1;
                  return a.id - b.id;
                });
              });

              const pairs = [];
              Object.entries(groups).forEach(([groupKey, list]) => {
                if (list.length < 2) return;
                list.slice(1).forEach((game, idx) => {
                  pairs.push({
                    key: groupKey,
                    from: list[idx],
                    to: game,
                  });
                });
              });
              return pairs;
            };

            const devPairs = makeConnections(games, "designer");
            const studioPairs = makeConnections(games, "studio");

            // Avoid perfect overlap — check for shared pairs
            const samePairKey = (a, b) =>
              (a.from.id === b.from.id && a.to.id === b.to.id) ||
              (a.from.id === b.to.id && a.to.id === b.from.id);

            return (
              <>
                {/* Developer connections (blue) */}
                {showDeveloperLines &&
                  devPairs.map((p, i) => {
                    const from = positions[p.from.id] || { x: p.from.x, y: p.from.y };
                    const to = positions[p.to.id] || { x: p.to.x, y: p.to.y };

                    const hasStudio = studioPairs.some((s) => samePairKey(p, s));
                    const offset = hasStudio ? -lineOffset : 0;

                    return (
                      <line
                        key={`dev-${p.from.id}-${p.to.id}-${i}`}
                        x1={from.x + 48}
                        y1={from.y + 48 + offset}
                        x2={to.x + 48}
                        y2={to.y + 48 + offset}
                        stroke="rgba(30,110,255,0.65)"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    );
                  })}

                {/* Studio connections (green) */}
                {showStudioLines &&
                  studioPairs.map((p, i) => {
                    const from = positions[p.from.id] || { x: p.from.x, y: p.from.y };
                    const to = positions[p.to.id] || { x: p.to.x, y: p.to.y };

                    const hasDev = devPairs.some((d) => samePairKey(p, d));
                    const offset = hasDev ? lineOffset : 0;

                    return (
                      <line
                        key={`studio-${p.from.id}-${p.to.id}-${i}`}
                        x1={from.x + 48}
                        y1={from.y + 48 + offset}
                        x2={to.x + 48}
                        y2={to.y + 48 + offset}
                        stroke="rgba(0,180,100,0.65)"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    );
                  })}

              </>
            );
          })()}


          {games.map((game) => {
            const pos = positions[game.id] || { x: game.x, y: game.y };
            return (
              <g
                key={game.id}
                data-id={game.id}
                className="cursor-pointer game-node group"
                transform={`translate(${pos.x}, ${pos.y})`}
                onClick={() => !editMode && onSelect(game)}
              >
                <image
                  href={game.image}
                  width="96"
                  height="96"
                  className="rounded-xl shadow-md border-2 border-white group-hover:scale-110 transition-transform"
                />
                <text
                  x="48"
                  y="110"
                  textAnchor="middle"
                  className="text-xs fill-gray-700"
                >
                  {game.title}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}

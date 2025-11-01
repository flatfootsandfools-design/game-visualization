// src/components/GameInfoPanel.jsx
export default function GameInfoPanel({ game, onClose }) {
  console.log("🗂️ GameInfoPanel render", game?.title);
  if (!game) return null;

  const links = [
    { name: "Steam", url: game.steam },
    { name: "Itch.io", url: game.itch },
    { name: "GOG", url: game.gog },
  ].filter((link) => link.url);

  return (
    <>
      {/* Dim background overlay (clicking it closes the panel) */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black bg-opacity-40 z-[90]"
      ></div>

      {/* ✅ Main folder panel */}
      <div
        className="fixed top-0 right-0 h-full w-[420px] max-w-[90vw] border-l border-gray-400 z-[9999] flex flex-col"
        style={{
          // make top 40 px transparent, everything below manila
          background: `
  linear-gradient(to bottom,
    rgba(243,226,179,0) 0px,
    rgba(243,226,179,0) 45px,
    rgba(243,226,179,0.95) 46px,
    rgba(243,226,179,0.95) 100%)
`,
          backdropFilter: "blur(2px)", // keep blur for subtle depth
          boxShadow: `
    -6px 0 15px rgba(0, 0, 0, 0.35),
    0 2px 10px rgba(0, 0, 0, 0.25),
    inset 3px 0 4px rgba(255, 255, 255, 0.3)
  `,
          borderTopLeftRadius: "10px",
          borderBottomLeftRadius: "10px",
          position: "fixed",
          right: "0",
          top: "0",
          zIndex: 9999,
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        {/* Manila header overlay directly behind the tab (left 70%) */}
        <div
          className="absolute top-0 left-0"
          style={{
            width: "70%",                    // match the tab width only
            height: "45px",                  // slightly taller than tab for seamless blend
            backgroundColor: "rgba(243,226,179,0.95)",
            pointerEvents: "none",           // allow clicks through
            zIndex: 0,                       // sit behind the tab/close button
          }}
        ></div>
        {/* Transparent cutout at top-right */}
        <div
          className="absolute top-0 right-0 h-10 w-[30%]"
          style={{
            background: "transparent",
            zIndex: 10000,
          }}
        ></div>
        {/* Folder header (tab + close button, split into two zones) */}
        <div
          className="absolute top-0 left-0 w-full h-10 flex justify-between"
          style={{ zIndex: 10001 }}
        >
          {/* Left (manila tab with title) */}
          <div
            className="flex items-center justify-center h-full w-[70%] rounded-tl-md"
            style={{
              backgroundColor: "#f8ebc5",
              backgroundImage: "linear-gradient(to bottom, #fff8d8, #f3e2b3)",
              borderBottom: "2px solid #e0cda4",
              boxShadow: `
        0 2px 5px rgba(0,0,0,0.15),
        inset 0 -1px 2px rgba(0,0,0,0.1)
      `,
              borderTopLeftRadius: "10px",
            }}
          >
            <span
              className="text-sm font-semibold text-[#3b2e1d] text-center truncate w-full"
              style={{
                fontFamily: "'Courier New', monospace",
                textShadow: "1px 1px 0 rgba(255,255,255,0.4)",
              }}
            >
              {game.title}
            </span>
          </div>

          {/* Right (transparent zone showing corkboard behind) */}
          <div
            className="relative h-full w-[30%] flex items-center justify-end pr-3"
            style={{
              background: "transparent",
              backdropFilter: "none",
            }}
          >
            <button
              onClick={onClose}
              className="text-[#f7f3e9] hover:text-white text-xl font-bold transition-colors duration-150"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                textShadow: "0 0 4px rgba(0,0,0,0.4)",
                zIndex: 10002,
              }}
            >
              ✕
            </button>
          </div>
        </div>


        {/* Scrollable Content */}
        <div
          className="overflow-y-auto flex-1 relative"
          style={{
            marginTop: "3.25rem",
            paddingTop: "1rem",
            paddingBottom: "1rem",
          }}
        >
          <div className="w-full flex justify-center">
            <div className="w-[90%]">
              <div
                className="bg-[#f7e9c7] bg-opacity-80 rounded-xl px-8 py-8"
                style={{
                  boxShadow: `
                    inset 0 0 10px rgba(0, 0, 0, 0.12),
                    inset 0 2px 3px rgba(255, 255, 255, 0.4)
                  `,
                  backgroundImage: `
                    linear-gradient(180deg, rgba(255,255,255,0.15), rgba(0,0,0,0.05)),
                    repeating-linear-gradient(0deg, transparent, transparent 23px, rgba(0,0,0,0.02) 24px)
                  `,
                  backgroundBlendMode: "multiply",
                }}
              >
                <img
                  src={game.image}
                  alt={game.title}
                  className="rounded-lg mb-4 mt-4 w-full object-cover"
                />

                <h2 className="text-2xl font-bold mb-2 text-[#3b2e1d]">{game.title}</h2>
                <p className="text-gray-600 italic mb-3">
                  {game.length} hours • {game.year}
                </p>

                <p className="text-[#3b2e1d] mb-4">{game.description}</p>

                <div className="border-t border-[#d0b986] pt-3 text-sm text-[#3b2e1d] space-y-2">
                  {game.designer && (
                    <p>
                      <span className="font-semibold">Designer:</span> {game.designer}
                    </p>
                  )}
                  {game.studio && (
                    <p>
                      <span className="font-semibold">Studio:</span> {game.studio}
                    </p>
                  )}
                  {game.gameJam && (
                    <p>
                      <span className="font-semibold">Game Jam:</span> {game.gameJam}
                    </p>
                  )}

                  <p>
                    <span className="font-semibold">Release Status:</span>{" "}
                    {game.releaseStatus || "Unknown"}
                  </p>
                  <p>
                    <span className="font-semibold">Demo Available:</span>{" "}
                    {game.demo ? "Yes" : "No"}
                  </p>
                  <p>
                    <span className="font-semibold">Expansions:</span>{" "}
                    {game.expansions || "None"}
                  </p>
                  <p>
                    <span className="font-semibold">Free:</span>{" "}
                    {game.free ? "Yes" : "No"}
                  </p>
                  <p>
                    <span className="font-semibold">First Person Motion:</span>{" "}
                    {game.firstPersonMotion ? "Yes" : "No"}
                  </p>
                  <p>
                    <span className="font-semibold">Action / Time Pressure:</span>{" "}
                    {game.actionPressure ? "Yes" : "No"}
                  </p>
                  <p>
                    <span className="font-semibold">Audio Required:</span>{" "}
                    {game.audioRequired ? "Yes" : "No"}
                  </p>
                </div>


                {links.length > 0 && (
                  <div className="border-t pt-4 mt-4">
                    <h3 className="font-semibold text-[#3b2e1d] mb-2">Available On:</h3>
                    <ul className="space-y-2">
                      {links.map((link) => (
                        <li key={link.name}>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-700 hover:underline font-medium block"
                          >
                            {link.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div> {/* end paper */}
            </div>   {/* end inner width wrapper */}
          </div>     {/* end flex centering */}
        </div>       {/* end scroll area */}
      </div>         {/* ✅ end main folder panel */}
    </>
  );
}

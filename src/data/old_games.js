export const games = [
  {
    id: 200101,
    title: "Phoenix Wright: Ace Attorney",
    image: "https://shared.fastly.steamstatic.com/community_assets/images/apps/787480/597e04c49eca04d70d7c4e6059b11df4b3ae4411_thumb.jpg",
    length: 18,
    year: 2001,
    description: "The Original Ace Attorney",
    x: 100,
    y: 300,
    releaseStatus: "Released",
    demo: false,
    expansions: "Phoenix Wright Trilogy",
    free: false,
    firstPersonMotion: false,
    actionPressure: false,
    audioRequired: true,
    steam: "https://store.steampowered.com/app/787480/",
    itch: null,
    gog: null
  },
  {
    id: 201501,
    title: "Her Story",
    image: "https://shared.fastly.steamstatic.com/community_assets/images/apps/368370/a05fc37b598a1ae5176b2a95a4819bfa0b93c4e5_thumb.jpg",
    length: 3,
    year: 2015,
    description: "Purpose built detective game",
    x: 400,
    y: 200,
    releaseStatus: "Released",
    demo: false,
    expansions: null,
    free: false,
    firstPersonMotion: false,
    actionPressure: false,
    audioRequired: true,
    steam: "https://store.steampowered.com/app/368370/",
    itch: null,
    gog: null
  },
  {
    id: 201801,
    title: "Return of the Obra Dinn",
    image: "https://shared.fastly.steamstatic.com/community_assets/images/apps/653530/f57b16f14fbdc1c39bda246d208968514902e581_thumb.jpg",
    length: 8,
    year: 2018,
    description: "Accidental detective game",
    x: 700,
    y: 350,
    releaseStatus: "Released",
    demo: true,
    expansions: null,
    free: false,
    firstPersonMotion: false,
    actionPressure: true,
    audioRequired: true,
    steam: "https://store.steampowered.com/app/653530/",
    itch: null,
    gog: "https://www.gog.com/game/return_of_the_obra_dinn"
  }
];


export const categorizeByLength = (games) => {
  return games.map(game => {
    let lengthCategory = "Medium";

    if (game.length <= 5) lengthCategory = "Short";
    else if (game.length >= 12) lengthCategory = "Long";

    return { ...game, lengthCategory };
  });
};


var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");

// src/services/mockTmdbData.ts
var POPULAR_GENRES = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 27, name: "Horror" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Sci-Fi" },
  { id: 53, name: "Thriller" }
];
var POPULAR_PROVIDERS = [
  { provider_id: 8, provider_name: "Netflix", logo_path: "https://image.tmdb.org/t/p/w92/9A1JSVmSxsS3LIL4E89kiA8R3bd.jpg" },
  { provider_id: 119, provider_name: "Amazon Prime Video", logo_path: "https://image.tmdb.org/t/p/w92/p5162P333L2M3p8d4474M686d87.jpg" },
  { provider_id: 337, provider_name: "Disney+", logo_path: "https://image.tmdb.org/t/p/w92/97829283738.jpg" },
  { provider_id: 15, provider_name: "Hulu", logo_path: "https://image.tmdb.org/t/p/w92/giwM893f63k3.jpg" },
  { provider_id: 1899, provider_name: "Max", logo_path: "https://image.tmdb.org/t/p/w92/3k284.jpg" },
  { provider_id: 2, provider_name: "Apple TV+", logo_path: "https://image.tmdb.org/t/p/w92/pe2838382.jpg" },
  { provider_id: 386, provider_name: "Peacock", logo_path: "https://image.tmdb.org/t/p/w92/38293.jpg" },
  { provider_id: 531, provider_name: "Paramount+", logo_path: "https://image.tmdb.org/t/p/w92/p182.jpg" }
];
var MOCK_MOVIES = [
  {
    id: 157336,
    title: "Interstellar",
    overview: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
    poster_path: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w1280/xJHokMbljvjADYdit5fK1R3O2y3.jpg",
    release_date: "2014-11-05",
    vote_average: 8.4,
    vote_count: 34500,
    genre_ids: [12, 18, 878],
    genres: ["Adventure", "Drama", "Science Fiction"],
    runtime: 169,
    cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain", "Michael Caine"]
  },
  {
    id: 27205,
    title: "Inception",
    overview: "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to have his criminal history erased as payment for the implantation of another person's idea into a target's subconscious.",
    poster_path: "https://image.tmdb.org/t/p/w500/oYuLE1311oA8h3A181P3A18.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w1280/8ZTV21C1vR2.jpg",
    release_date: "2010-07-15",
    vote_average: 8.4,
    vote_count: 36e3,
    genre_ids: [28, 12, 878],
    genres: ["Action", "Adventure", "Sci-Fi"],
    runtime: 148,
    cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page", "Tom Hardy"]
  },
  {
    id: 299536,
    title: "Avengers: Infinity War",
    overview: "As the Avengers and their allies have continued to protect the world from threats too large for any one hero to handle, a new danger has emerged from the cosmic shadows: Thanos.",
    poster_path: "https://image.tmdb.org/t/p/w500/7WsyChLLEz33B3.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w1280/bOG2349.jpg",
    release_date: "2018-04-25",
    vote_average: 8.3,
    vote_count: 29e3,
    genre_ids: [28, 12, 878],
    genres: ["Action", "Adventure", "Sci-Fi"],
    runtime: 149,
    cast: ["Robert Downey Jr.", "Chris Hemsworth", "Mark Ruffalo", "Chris Evans"]
  },
  {
    id: 550,
    title: "Fight Club",
    overview: 'A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy. Their concept catches on, with underground "fight clubs" forming in every town.',
    poster_path: "https://image.tmdb.org/t/p/w500/pB8BMmvJ2.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w1280/hZk3238.jpg",
    release_date: "1999-10-15",
    vote_average: 8.4,
    vote_count: 28e3,
    genre_ids: [18, 53],
    genres: ["Drama", "Thriller"],
    runtime: 139,
    cast: ["Brad Pitt", "Edward Norton", "Helena Bonham Carter", "Meat Loaf"]
  },
  {
    id: 129,
    title: "Spirited Away",
    overview: "A young girl, Chihiro, becomes trapped in a strange new world of spirits. When her parents undergo a mysterious transformation, she must call upon the courage she never knew she had to free her family.",
    poster_path: "https://image.tmdb.org/t/p/w500/393189283.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w1280/Ab82384.jpg",
    release_date: "2001-07-20",
    vote_average: 8.5,
    vote_count: 16500,
    genre_ids: [16, 10751, 14],
    genres: ["Animation", "Family", "Fantasy"],
    runtime: 125,
    cast: ["Rumi Hiiragi", "Miyu Irino", "Mari Natsuki", "Takeshi Naito"]
  },
  {
    id: 693134,
    title: "Dune: Part Two",
    overview: "Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family.",
    poster_path: "https://image.tmdb.org/t/p/w500/1pdfL3328.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w1280/xOM29384.jpg",
    release_date: "2024-02-27",
    vote_average: 8.2,
    vote_count: 5400,
    genre_ids: [878, 12, 18],
    genres: ["Sci-Fi", "Adventure", "Drama"],
    runtime: 166,
    cast: ["Timoth\xE9e Chalamet", "Zendaya", "Rebecca Ferguson", "Javier Bardem"]
  },
  {
    id: 872585,
    title: "Oppenheimer",
    overview: "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II.",
    poster_path: "https://image.tmdb.org/t/p/w500/8Gxv838.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w1280/fm62849.jpg",
    release_date: "2023-07-19",
    vote_average: 8.1,
    vote_count: 8800,
    genre_ids: [18, 36],
    genres: ["Drama", "History"],
    runtime: 180,
    cast: ["Cillian Murphy", "Emily Blunt", "Matt Damon", "Robert Downey Jr."]
  },
  {
    id: 508883,
    title: "The Boy and the Heron",
    overview: "While the Second World War rages, the teenage Mahito, haunted by his mother's tragic death, is relocated from Tokyo to the serene rural countryside house of his family.",
    poster_path: "https://image.tmdb.org/t/p/w500/f239842.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w1280/f328492.jpg",
    release_date: "2023-07-14",
    vote_average: 7.7,
    vote_count: 2100,
    genre_ids: [16, 14, 12],
    genres: ["Animation", "Fantasy", "Adventure"],
    runtime: 124,
    cast: ["Soma Santoki", "Masaki Suda", "Aimyon", "Yoshino Kimura"]
  },
  {
    id: 569094,
    title: "Spider-Man: Across the Spider-Verse",
    overview: "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.",
    poster_path: "https://image.tmdb.org/t/p/w500/8Vt6m2.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w1280/48384.jpg",
    release_date: "2023-05-31",
    vote_average: 8.4,
    vote_count: 6700,
    genre_ids: [16, 28, 12, 878],
    genres: ["Animation", "Action", "Adventure", "Sci-Fi"],
    runtime: 140,
    cast: ["Shameik Moore", "Hailee Steinfeld", "Oscar Isaac", "Jake Johnson"]
  },
  {
    id: 493529,
    title: "Paddington 2",
    overview: "Paddington, now happily settled with the Brown family and a popular member of the local community, picks up a series of odd jobs to buy the perfect present for his Aunt Lucy's 100th birthday.",
    poster_path: "https://image.tmdb.org/t/p/w500/3819483.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w1280/f839284.jpg",
    release_date: "2017-11-10",
    vote_average: 7.5,
    vote_count: 2200,
    genre_ids: [35, 10751, 12],
    genres: ["Comedy", "Family", "Adventure"],
    runtime: 103,
    cast: ["Ben Whishaw", "Hugh Grant", "Sally Hawkins", "Hugh Bonneville"]
  },
  {
    id: 38700,
    title: "Bad Boys for Life",
    overview: "Marcus and Mike are on top of the world until Mike is targeted by a ruthless mercenary whose mother holds a deadly grudge against Mike.",
    poster_path: "https://image.tmdb.org/t/p/w500/y9537482.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w1280/up38482.jpg",
    release_date: "2020-01-15",
    vote_average: 7.2,
    vote_count: 7600,
    genre_ids: [28, 80, 35],
    genres: ["Action", "Crime", "Comedy"],
    runtime: 124,
    cast: ["Will Smith", "Martin Lawrence", "Paola Nu\xF1ez", "Vanessa Hudgens"]
  },
  {
    id: 414906,
    title: "The Batman",
    overview: "In his second year of fighting crime, Batman uncovers corruption in Gotham City that connects to his own family while facing a serial killer known as the Riddler.",
    poster_path: "https://image.tmdb.org/t/p/w500/74428.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w1280/828234.jpg",
    release_date: "2022-03-01",
    vote_average: 7.7,
    vote_count: 9800,
    genre_ids: [80, 9648, 53],
    genres: ["Crime", "Mystery", "Thriller"],
    runtime: 176,
    cast: ["Robert Pattinson", "Zo\xEB Kravitz", "Paul Dano", "Colin Farrell"]
  }
];
var MOCK_WATCH_PROVIDERS = {
  157336: {
    flatrate: [
      { provider_id: 8, provider_name: "Netflix", logo_path: "https://image.tmdb.org/t/p/w92/9A1JSVmSxsS3LIL4E89kiA8R3bd.jpg" },
      { provider_id: 119, provider_name: "Amazon Prime Video", logo_path: "https://image.tmdb.org/t/p/w92/p5162P333L2M3p8d4474M686d87.jpg" }
    ],
    rent: [
      { provider_id: 2, provider_name: "Apple TV", logo_path: "https://image.tmdb.org/t/p/w92/pe2838382.jpg" },
      { provider_id: 3, provider_name: "Google Play Movies", logo_path: "https://image.tmdb.org/t/p/w92/83818.jpg" }
    ],
    buy: [
      { provider_id: 2, provider_name: "Apple TV", logo_path: "https://image.tmdb.org/t/p/w92/pe2838382.jpg" }
    ]
  },
  27205: {
    flatrate: [
      { provider_id: 1899, provider_name: "Max", logo_path: "https://image.tmdb.org/t/p/w92/3k284.jpg" },
      { provider_id: 119, provider_name: "Amazon Prime Video", logo_path: "https://image.tmdb.org/t/p/w92/p5162P333L2M3p8d4474M686d87.jpg" }
    ],
    rent: [
      { provider_id: 2, provider_name: "Apple TV", logo_path: "https://image.tmdb.org/t/p/w92/pe2838382.jpg" }
    ],
    buy: [
      { provider_id: 2, provider_name: "Apple TV", logo_path: "https://image.tmdb.org/t/p/w92/pe2838382.jpg" }
    ]
  },
  299536: {
    flatrate: [
      { provider_id: 337, provider_name: "Disney+", logo_path: "https://image.tmdb.org/t/p/w92/97829283738.jpg" }
    ],
    rent: [
      { provider_id: 2, provider_name: "Apple TV", logo_path: "https://image.tmdb.org/t/p/w92/pe2838382.jpg" }
    ]
  },
  693134: {
    flatrate: [
      { provider_id: 1899, provider_name: "Max", logo_path: "https://image.tmdb.org/t/p/w92/3k284.jpg" }
    ],
    rent: [
      { provider_id: 119, provider_name: "Amazon Prime Video", logo_path: "https://image.tmdb.org/t/p/w92/p5162P333L2M3p8d4474M686d87.jpg" },
      { provider_id: 2, provider_name: "Apple TV", logo_path: "https://image.tmdb.org/t/p/w92/pe2838382.jpg" }
    ]
  }
};

// server.ts
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json());
var rooms = {};
var sseClients = {};
function generateRoomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return rooms[code] ? generateRoomCode() : code;
}
function broadcastRoomEvent(roomCode, type, payload) {
  const clients = sseClients[roomCode.toUpperCase()] || [];
  const eventData = `data: ${JSON.stringify({ type, roomCode, payload, timestamp: Date.now() })}

`;
  clients.forEach((res) => {
    try {
      res.write(eventData);
    } catch {
    }
  });
}
async function fetchMoviesForRoom(settings) {
  const apiKey = process.env.TMDB_API_KEY;
  if (apiKey) {
    try {
      const genreParam = settings.selectedGenres.length > 0 ? settings.selectedGenres.join(",") : "";
      const yearMin = settings.yearRange[0];
      const yearMax = settings.yearRange[1];
      const providerParam = settings.selectedProviders.length > 0 ? settings.selectedProviders.join("|") : "";
      const url = new URL("https://api.themoviedb.org/3/discover/movie");
      url.searchParams.set("api_key", apiKey);
      url.searchParams.set("language", "en-US");
      url.searchParams.set("sort_by", "popularity.desc");
      url.searchParams.set("include_adult", "false");
      url.searchParams.set("vote_average.gte", settings.minRating.toString());
      url.searchParams.set("primary_release_date.gte", `${yearMin}-01-01`);
      url.searchParams.set("primary_release_date.lte", `${yearMax}-12-31`);
      if (genreParam) url.searchParams.set("with_genres", genreParam);
      if (providerParam) {
        url.searchParams.set("with_watch_providers", providerParam);
        url.searchParams.set("watch_region", settings.region || "US");
      }
      const res = await fetch(url.toString());
      if (res.ok) {
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          return data.results.map((m) => ({
            id: m.id,
            title: m.title,
            overview: m.overview || "No synopsis available.",
            poster_path: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null,
            backdrop_path: m.backdrop_path ? `https://image.tmdb.org/t/p/w1280${m.backdrop_path}` : null,
            release_date: m.release_date || "N/A",
            vote_average: Math.round((m.vote_average || 0) * 10) / 10,
            vote_count: m.vote_count || 0,
            genre_ids: m.genre_ids || []
          }));
        }
      }
    } catch (err) {
      console.error("TMDB API fetch error, using fallback:", err);
    }
  }
  let filtered = [...MOCK_MOVIES];
  if (settings.selectedGenres.length > 0) {
    filtered = filtered.filter((m) => m.genre_ids.some((g) => settings.selectedGenres.includes(g)));
  }
  filtered = filtered.filter((m) => {
    const year = parseInt((m.release_date || "").substring(0, 4), 10) || 2020;
    return year >= settings.yearRange[0] && year <= settings.yearRange[1];
  });
  if (settings.minRating > 0) {
    filtered = filtered.filter((m) => m.vote_average >= settings.minRating);
  }
  return filtered.length >= 5 ? filtered : MOCK_MOVIES;
}
app.post("/api/rooms", async (req, res) => {
  const { displayName, uid, settings: customSettings } = req.body;
  if (!displayName || !uid) {
    return res.status(400).json({ message: "Display name and UID are required" });
  }
  const roomCode = generateRoomCode();
  const defaultSettings = {
    selectedGenres: [],
    yearRange: [1990, 2026],
    minRating: 6,
    selectedProviders: [],
    matchThreshold: "everyone",
    region: "US",
    movieCount: 20,
    ...customSettings
  };
  const movies = await fetchMoviesForRoom(defaultSettings);
  const newRoom = {
    roomCode,
    hostUid: uid,
    createdAt: Date.now(),
    status: "lobby",
    settings: defaultSettings,
    members: {
      [uid]: {
        uid,
        displayName,
        joinedAt: Date.now(),
        isHost: true,
        isActive: true,
        swipeCount: 0
      }
    },
    swipes: {
      [uid]: []
    },
    matches: {},
    movies
  };
  rooms[roomCode] = newRoom;
  return res.json({ room: newRoom });
});
app.get("/api/rooms/:roomCode", (req, res) => {
  const code = req.params.roomCode.toUpperCase();
  const room = rooms[code];
  if (!room) {
    return res.status(404).json({ message: "Room not found" });
  }
  return res.json({ room });
});
app.post("/api/rooms/:roomCode/join", (req, res) => {
  const code = req.params.roomCode.toUpperCase();
  const { displayName, uid } = req.body;
  const room = rooms[code];
  if (!room) {
    return res.status(404).json({ message: "Room not found" });
  }
  if (!room.members[uid]) {
    room.members[uid] = {
      uid,
      displayName: displayName || `Guest ${Object.keys(room.members).length + 1}`,
      joinedAt: Date.now(),
      isHost: false,
      isActive: true,
      swipeCount: 0
    };
    room.swipes[uid] = room.swipes[uid] || [];
  } else {
    room.members[uid].isActive = true;
    if (displayName) room.members[uid].displayName = displayName;
  }
  broadcastRoomEvent(code, "member_joined", room);
  return res.json({ room });
});
app.post("/api/rooms/:roomCode/settings", async (req, res) => {
  const code = req.params.roomCode.toUpperCase();
  const { settings } = req.body;
  const room = rooms[code];
  if (!room) {
    return res.status(404).json({ message: "Room not found" });
  }
  room.settings = { ...room.settings, ...settings };
  room.movies = await fetchMoviesForRoom(room.settings);
  broadcastRoomEvent(code, "settings_updated", room);
  return res.json({ room });
});
app.post("/api/rooms/:roomCode/start", async (req, res) => {
  const code = req.params.roomCode.toUpperCase();
  const room = rooms[code];
  if (!room) {
    return res.status(404).json({ message: "Room not found" });
  }
  if (room.movies.length === 0) {
    room.movies = await fetchMoviesForRoom(room.settings);
  }
  room.status = "active";
  broadcastRoomEvent(code, "session_started", room);
  return res.json({ room });
});
app.post("/api/rooms/:roomCode/swipe", (req, res) => {
  const code = req.params.roomCode.toUpperCase();
  const { uid, movieId, vote } = req.body;
  const room = rooms[code];
  if (!room) {
    return res.status(404).json({ message: "Room not found" });
  }
  room.swipes[uid] = room.swipes[uid] || [];
  const existingIndex = room.swipes[uid].findIndex((s) => s.movieId === movieId);
  if (existingIndex >= 0) {
    room.swipes[uid][existingIndex] = { uid, movieId, vote, timestamp: Date.now() };
  } else {
    room.swipes[uid].push({ uid, movieId, vote, timestamp: Date.now() });
  }
  if (room.members[uid]) {
    room.members[uid].swipeCount = room.swipes[uid].length;
    if (room.swipes[uid].length >= room.movies.length) {
      room.members[uid].finishedSwiping = true;
    }
  }
  let newMatch = void 0;
  if (vote === "like") {
    const activeMembers = Object.values(room.members).filter((m) => m.isActive);
    const activeUids = activeMembers.map((m) => m.uid);
    const likingUids = [];
    activeUids.forEach((memberUid) => {
      const memberSwipes = room.swipes[memberUid] || [];
      const hasLiked = memberSwipes.some((s) => s.movieId === movieId && s.vote === "like");
      if (hasLiked) {
        likingUids.push(memberUid);
      }
    });
    const threshold = room.settings.matchThreshold;
    let isMatch = false;
    if (threshold === "everyone") {
      const required = Math.max(1, activeMembers.length);
      isMatch = likingUids.length >= required;
    } else if (threshold === "majority") {
      const required = Math.max(2, Math.ceil(activeMembers.length / 2));
      isMatch = likingUids.length >= required;
    } else if (threshold === "threshold_2") {
      isMatch = likingUids.length >= 2;
    }
    if (isMatch && !room.matches[movieId]) {
      const movieSnapshot = room.movies.find((m) => m.id === movieId) || {
        id: movieId,
        title: `Movie ${movieId}`,
        overview: "",
        poster_path: null,
        backdrop_path: null,
        release_date: "",
        vote_average: 8,
        vote_count: 100,
        genre_ids: []
      };
      newMatch = {
        movieId,
        matchedAt: Date.now(),
        matchedUids: likingUids,
        movieSnapshot
      };
      room.matches[movieId] = newMatch;
    }
  }
  if (newMatch) {
    broadcastRoomEvent(code, "match_found", { room, match: newMatch });
  } else {
    broadcastRoomEvent(code, "swipe_recorded", room);
  }
  return res.json({ room, newMatch });
});
app.get("/api/tmdb/movie/:id/providers", async (req, res) => {
  const movieId = parseInt(req.params.id, 10);
  const region = req.query.region || "US";
  const apiKey = process.env.TMDB_API_KEY;
  if (apiKey) {
    try {
      const tmdbRes = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${apiKey}`);
      if (tmdbRes.ok) {
        const data = await tmdbRes.json();
        const regionData = data.results ? data.results[region.toUpperCase()] || data.results["US"] : null;
        if (regionData) {
          const formatProvider = (p) => ({
            provider_id: p.provider_id,
            provider_name: p.provider_name,
            logo_path: p.logo_path ? `https://image.tmdb.org/t/p/w92${p.logo_path}` : ""
          });
          const providers = {
            link: regionData.link,
            flatrate: (regionData.flatrate || []).map(formatProvider),
            rent: (regionData.rent || []).map(formatProvider),
            buy: (regionData.buy || []).map(formatProvider)
          };
          return res.json({ providers });
        }
      }
    } catch (err) {
      console.error("TMDB watch providers fetch error:", err);
    }
  }
  const mockProviders = MOCK_WATCH_PROVIDERS[movieId] || {
    flatrate: [POPULAR_PROVIDERS[0], POPULAR_PROVIDERS[1]],
    rent: [POPULAR_PROVIDERS[5]],
    buy: [POPULAR_PROVIDERS[5]]
  };
  return res.json({ providers: mockProviders });
});
app.get("/api/tmdb/genres", (req, res) => {
  return res.json({ genres: POPULAR_GENRES, providers: POPULAR_PROVIDERS });
});
app.get("/api/rooms/:roomCode/events", (req, res) => {
  const code = req.params.roomCode.toUpperCase();
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();
  sseClients[code] = sseClients[code] || [];
  sseClients[code].push(res);
  req.on("close", () => {
    sseClients[code] = (sseClients[code] || []).filter((client) => client !== res);
  });
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`\u{1F3AC} Movie Night Matcher Server running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map

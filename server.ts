import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import { Room, RoomSettings, Movie, Match, Member, WatchProviderResults } from './src/types';
import { MOCK_MOVIES, MOCK_WATCH_PROVIDERS, POPULAR_GENRES, POPULAR_PROVIDERS } from './src/services/mockTmdbData';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory Room Store
const rooms: Record<string, Room> = {};

// SSE Client Connections Map: roomCode -> Response[]
const sseClients: Record<string, Response[]> = {};

// Helper: Generate 6-char human friendly code
function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No confusing O, 0, I, 1
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return rooms[code] ? generateRoomCode() : code;
}

// Helper: Broadcast SSE event to room
function broadcastRoomEvent(roomCode: string, type: string, payload: any) {
  const clients = sseClients[roomCode.toUpperCase()] || [];
  const eventData = `data: ${JSON.stringify({ type, roomCode, payload, timestamp: Date.now() })}\n\n`;
  clients.forEach(res => {
    try {
      res.write(eventData);
    } catch {
      // client dropped
    }
  });
}

// Fetch TMDB movies based on room filters
async function fetchMoviesForRoom(settings: RoomSettings): Promise<Movie[]> {
  const apiKey = process.env.TMDB_API_KEY;

  if (apiKey) {
    try {
      const genreParam = settings.selectedGenres.length > 0 ? settings.selectedGenres.join(',') : '';
      const yearMin = settings.yearRange[0];
      const yearMax = settings.yearRange[1];
      const providerParam = settings.selectedProviders.length > 0 ? settings.selectedProviders.join('|') : '';

      const url = new URL('https://api.themoviedb.org/3/discover/movie');
      url.searchParams.set('api_key', apiKey);
      url.searchParams.set('language', 'en-US');
      url.searchParams.set('sort_by', 'popularity.desc');
      url.searchParams.set('include_adult', 'false');
      url.searchParams.set('vote_average.gte', settings.minRating.toString());
      url.searchParams.set('primary_release_date.gte', `${yearMin}-01-01`);
      url.searchParams.set('primary_release_date.lte', `${yearMax}-12-31`);
      if (genreParam) url.searchParams.set('with_genres', genreParam);
      if (providerParam) {
        url.searchParams.set('with_watch_providers', providerParam);
        url.searchParams.set('watch_region', settings.region || 'US');
      }

      const res = await fetch(url.toString());
      if (res.ok) {
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          return data.results.map((m: any) => ({
            id: m.id,
            title: m.title,
            overview: m.overview || 'No synopsis available.',
            poster_path: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null,
            backdrop_path: m.backdrop_path ? `https://image.tmdb.org/t/p/w1280${m.backdrop_path}` : null,
            release_date: m.release_date || 'N/A',
            vote_average: Math.round((m.vote_average || 0) * 10) / 10,
            vote_count: m.vote_count || 0,
            genre_ids: m.genre_ids || []
          }));
        }
      }
    } catch (err) {
      console.error('TMDB API fetch error, using fallback:', err);
    }
  }

  // Filter fallback MOCK_MOVIES
  let filtered = [...MOCK_MOVIES];
  if (settings.selectedGenres.length > 0) {
    filtered = filtered.filter(m => m.genre_ids.some(g => settings.selectedGenres.includes(g)));
  }
  filtered = filtered.filter(m => {
    const year = parseInt((m.release_date || '').substring(0, 4), 10) || 2020;
    return year >= settings.yearRange[0] && year <= settings.yearRange[1];
  });
  if (settings.minRating > 0) {
    filtered = filtered.filter(m => m.vote_average >= settings.minRating);
  }

  // If filtered set is too small, return all mock movies so group has plenty to swipe
  return filtered.length >= 5 ? filtered : MOCK_MOVIES;
}

// API Routes

// 1. Create Room
app.post('/api/rooms', async (req: Request, res: Response) => {
  const { displayName, uid, settings: customSettings } = req.body;
  if (!displayName || !uid) {
    return res.status(400).json({ message: 'Display name and UID are required' });
  }

  const roomCode = generateRoomCode();
  const defaultSettings: RoomSettings = {
    selectedGenres: [],
    yearRange: [1990, 2026],
    minRating: 6.0,
    selectedProviders: [],
    matchThreshold: 'everyone',
    region: 'US',
    movieCount: 20,
    ...customSettings
  };

  const movies = await fetchMoviesForRoom(defaultSettings);

  const newRoom: Room = {
    roomCode,
    hostUid: uid,
    createdAt: Date.now(),
    status: 'lobby',
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

// 2. Get Room
app.get('/api/rooms/:roomCode', (req: Request, res: Response) => {
  const code = req.params.roomCode.toUpperCase();
  const room = rooms[code];
  if (!room) {
    return res.status(404).json({ message: 'Room not found' });
  }
  return res.json({ room });
});

// 3. Join Room
app.post('/api/rooms/:roomCode/join', (req: Request, res: Response) => {
  const code = req.params.roomCode.toUpperCase();
  const { displayName, uid } = req.body;

  const room = rooms[code];
  if (!room) {
    return res.status(404).json({ message: 'Room not found' });
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
    // Update active status & display name
    room.members[uid].isActive = true;
    if (displayName) room.members[uid].displayName = displayName;
  }

  broadcastRoomEvent(code, 'member_joined', room);
  return res.json({ room });
});

// 4. Update Settings
app.post('/api/rooms/:roomCode/settings', async (req: Request, res: Response) => {
  const code = req.params.roomCode.toUpperCase();
  const { settings } = req.body;

  const room = rooms[code];
  if (!room) {
    return res.status(404).json({ message: 'Room not found' });
  }

  room.settings = { ...room.settings, ...settings };
  // Refetch movies according to new filters
  room.movies = await fetchMoviesForRoom(room.settings);

  broadcastRoomEvent(code, 'settings_updated', room);
  return res.json({ room });
});

// 5. Start Session
app.post('/api/rooms/:roomCode/start', async (req: Request, res: Response) => {
  const code = req.params.roomCode.toUpperCase();
  const room = rooms[code];
  if (!room) {
    return res.status(404).json({ message: 'Room not found' });
  }

  if (room.movies.length === 0) {
    room.movies = await fetchMoviesForRoom(room.settings);
  }

  room.status = 'active';
  broadcastRoomEvent(code, 'session_started', room);
  return res.json({ room });
});

// 6. Submit Swipe & Calculate Matches
app.post('/api/rooms/:roomCode/swipe', (req: Request, res: Response) => {
  const code = req.params.roomCode.toUpperCase();
  const { uid, movieId, vote } = req.body;

  const room = rooms[code];
  if (!room) {
    return res.status(404).json({ message: 'Room not found' });
  }

  room.swipes[uid] = room.swipes[uid] || [];
  // Prevent duplicate swipe recording for same movie
  const existingIndex = room.swipes[uid].findIndex(s => s.movieId === movieId);
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

  // Calculate Match logic
  let newMatch: Match | undefined = undefined;

  if (vote === 'like') {
    const activeMembers = Object.values(room.members).filter(m => m.isActive);
    const activeUids = activeMembers.map(m => m.uid);

    // Find all active members who liked this movie
    const likingUids: string[] = [];
    activeUids.forEach(memberUid => {
      const memberSwipes = room.swipes[memberUid] || [];
      const hasLiked = memberSwipes.some(s => s.movieId === movieId && s.vote === 'like');
      if (hasLiked) {
        likingUids.push(memberUid);
      }
    });

    const threshold = room.settings.matchThreshold;
    let isMatch = false;

    if (threshold === 'everyone') {
      // Match when ALL active members like it (min 2 members required unless only 1 person in room)
      const required = Math.max(1, activeMembers.length);
      isMatch = likingUids.length >= required;
    } else if (threshold === 'majority') {
      const required = Math.max(2, Math.ceil(activeMembers.length / 2));
      isMatch = likingUids.length >= required;
    } else if (threshold === 'threshold_2') {
      isMatch = likingUids.length >= 2;
    }

    if (isMatch && !room.matches[movieId]) {
      const movieSnapshot = room.movies.find(m => m.id === movieId) || {
        id: movieId,
        title: `Movie ${movieId}`,
        overview: '',
        poster_path: null,
        backdrop_path: null,
        release_date: '',
        vote_average: 8.0,
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
    broadcastRoomEvent(code, 'match_found', { room, match: newMatch });
  } else {
    broadcastRoomEvent(code, 'swipe_recorded', room);
  }

  return res.json({ room, newMatch });
});

// 7. Get Watch Providers for Movie
app.get('/api/tmdb/movie/:id/providers', async (req: Request, res: Response) => {
  const movieId = parseInt(req.params.id, 10);
  const region = (req.query.region as string) || 'US';
  const apiKey = process.env.TMDB_API_KEY;

  if (apiKey) {
    try {
      const tmdbRes = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${apiKey}`);
      if (tmdbRes.ok) {
        const data = await tmdbRes.json();
        const regionData = data.results ? data.results[region.toUpperCase()] || data.results['US'] : null;
        if (regionData) {
          const formatProvider = (p: any) => ({
            provider_id: p.provider_id,
            provider_name: p.provider_name,
            logo_path: p.logo_path ? `https://image.tmdb.org/t/p/w92${p.logo_path}` : ''
          });

          const providers: WatchProviderResults = {
            link: regionData.link,
            flatrate: (regionData.flatrate || []).map(formatProvider),
            rent: (regionData.rent || []).map(formatProvider),
            buy: (regionData.buy || []).map(formatProvider)
          };

          return res.json({ providers });
        }
      }
    } catch (err) {
      console.error('TMDB watch providers fetch error:', err);
    }
  }

  // Fallback mock watch providers
  const mockProviders = MOCK_WATCH_PROVIDERS[movieId] || {
    flatrate: [POPULAR_PROVIDERS[0], POPULAR_PROVIDERS[1]],
    rent: [POPULAR_PROVIDERS[5]],
    buy: [POPULAR_PROVIDERS[5]]
  };

  return res.json({ providers: mockProviders });
});

// 8. Genres API
app.get('/api/tmdb/genres', (req: Request, res: Response) => {
  return res.json({ genres: POPULAR_GENRES, providers: POPULAR_PROVIDERS });
});

// 9. SSE Endpoint
app.get('/api/rooms/:roomCode/events', (req: Request, res: Response) => {
  const code = req.params.roomCode.toUpperCase();

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  sseClients[code] = sseClients[code] || [];
  sseClients[code].push(res);

  req.on('close', () => {
    sseClients[code] = (sseClients[code] || []).filter(client => client !== res);
  });
});

// Server Initialization with Vite integration
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🎬 Movie Night Matcher Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

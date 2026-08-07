export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  genres?: string[];
  runtime?: number;
  cast?: string[];
}

export interface WatchProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
  display_priority?: number;
}

export interface WatchProviderResults {
  link?: string;
  flatrate?: WatchProvider[];
  rent?: WatchProvider[];
  buy?: WatchProvider[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface Member {
  uid: string;
  displayName: string;
  joinedAt: number;
  isHost: boolean;
  isActive: boolean;
  finishedSwiping?: boolean;
  swipeCount?: number;
}

export type MatchThreshold = 'everyone' | 'majority' | 'threshold_2';

export interface RoomSettings {
  selectedGenres: number[];
  yearRange: [number, number];
  minRating: number;
  selectedProviders: number[];
  matchThreshold: MatchThreshold;
  region: string;
  movieCount: number;
}

export interface Swipe {
  uid: string;
  movieId: number;
  vote: 'like' | 'pass';
  timestamp: number;
}

export interface Match {
  movieId: number;
  matchedAt: number;
  matchedUids: string[];
  movieSnapshot: Movie;
}

export type RoomStatus = 'lobby' | 'active' | 'ended';

export interface Room {
  roomCode: string;
  hostUid: string;
  createdAt: number;
  status: RoomStatus;
  settings: RoomSettings;
  members: Record<string, Member>;
  swipes: Record<string, Swipe[]>; // uid -> swipes
  matches: Record<number, Match>; // movieId -> Match
  movies: Movie[];
}

export interface RoomEvent {
  type: 'member_joined' | 'member_left' | 'settings_updated' | 'session_started' | 'swipe_recorded' | 'match_found' | 'room_updated' | 'user_finished';
  roomCode: string;
  payload?: any;
}

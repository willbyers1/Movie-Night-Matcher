import { Room, RoomSettings, Movie, WatchProviderResults, Match } from '../types';

const BROADCAST_CHANNEL_NAME = 'movie_night_matcher_events';

class ApiService {
  private broadcastChannel: BroadcastChannel | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      this.broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
    }
  }

  // Generate local uid if not stored
  public getOrCreateUid(): string {
    let uid = localStorage.getItem('mnm_uid');
    if (!uid) {
      uid = 'user_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
      localStorage.setItem('mnm_uid', uid);
    }
    return uid;
  }

  public getSavedDisplayName(): string {
    return localStorage.getItem('mnm_display_name') || '';
  }

  public saveDisplayName(name: string): void {
    localStorage.setItem('mnm_display_name', name);
  }

  public async createRoom(displayName: string, settings?: Partial<RoomSettings>): Promise<{ room: Room; uid: string }> {
    const uid = this.getOrCreateUid();
    this.saveDisplayName(displayName);

    const res = await fetch('/api/rooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ displayName, uid, settings })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Failed to create room' }));
      throw new Error(err.message || 'Failed to create room');
    }

    const data = await res.json();
    return { room: data.room, uid };
  }

  public async getRoom(roomCode: string): Promise<Room> {
    const res = await fetch(`/api/rooms/${roomCode.toUpperCase()}`);
    if (!res.ok) {
      throw new Error('Room not found');
    }
    const data = await res.json();
    return data.room;
  }

  public async joinRoom(roomCode: string, displayName: string): Promise<{ room: Room; uid: string }> {
    const uid = this.getOrCreateUid();
    this.saveDisplayName(displayName);

    const res = await fetch(`/api/rooms/${roomCode.toUpperCase()}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ displayName, uid })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Failed to join room' }));
      throw new Error(err.message || 'Failed to join room');
    }

    const data = await res.json();
    this.notifyBroadcast(roomCode.toUpperCase(), 'member_joined', data.room);
    return { room: data.room, uid };
  }

  public async updateSettings(roomCode: string, settings: RoomSettings): Promise<Room> {
    const res = await fetch(`/api/rooms/${roomCode.toUpperCase()}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ settings })
    });

    if (!res.ok) {
      throw new Error('Failed to update room settings');
    }

    const data = await res.json();
    this.notifyBroadcast(roomCode.toUpperCase(), 'settings_updated', data.room);
    return data.room;
  }

  public async startSession(roomCode: string): Promise<Room> {
    const res = await fetch(`/api/rooms/${roomCode.toUpperCase()}/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Failed to start swiping session' }));
      throw new Error(err.message || 'Failed to start swiping session');
    }

    const data = await res.json();
    this.notifyBroadcast(roomCode.toUpperCase(), 'session_started', data.room);
    return data.room;
  }

  public async submitSwipe(
    roomCode: string,
    movieId: number,
    vote: 'like' | 'pass'
  ): Promise<{ room: Room; newMatch?: Match }> {
    const uid = this.getOrCreateUid();

    const res = await fetch(`/api/rooms/${roomCode.toUpperCase()}/swipe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid, movieId, vote })
    });

    if (!res.ok) {
      throw new Error('Failed to submit swipe');
    }

    const data = await res.json();
    if (data.newMatch) {
      this.notifyBroadcast(roomCode.toUpperCase(), 'match_found', { room: data.room, match: data.newMatch });
    } else {
      this.notifyBroadcast(roomCode.toUpperCase(), 'swipe_recorded', data.room);
    }

    return data;
  }

  public async getWatchProviders(movieId: number, region: string = 'US'): Promise<WatchProviderResults> {
    const res = await fetch(`/api/tmdb/movie/${movieId}/providers?region=${region}`);
    if (!res.ok) {
      return {};
    }
    const data = await res.json();
    return data.providers || {};
  }

  private notifyBroadcast(roomCode: string, type: string, payload: any) {
    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage({ roomCode, type, payload });
    }
  }

  public subscribeToRoom(roomCode: string, onEvent: (event: { type: string; room?: Room; payload?: any }) => void): () => void {
    const code = roomCode.toUpperCase();
    let es: EventSource | null = null;

    try {
      es = new EventSource(`/api/rooms/${code}/events`);
      es.onmessage = (e) => {
        try {
          const parsed = JSON.parse(e.data);
          onEvent(parsed);
        } catch (err) {
          console.error('SSE parse error:', err);
        }
      };
      es.onerror = () => {
        // Fallback polling if SSE drops
      };
    } catch (e) {
      console.warn('SSE not supported or failed to connect:', e);
    }

    // BroadcastChannel handler for multi-tab speed
    const bcHandler = (e: MessageEvent) => {
      if (e.data && e.data.roomCode === code) {
        onEvent({ type: e.data.type, payload: e.data.payload, room: e.data.payload?.room || e.data.payload });
      }
    };

    if (this.broadcastChannel) {
      this.broadcastChannel.addEventListener('message', bcHandler);
    }

    // Periodic poll fallback every 3 seconds to guarantee state sync
    const pollInterval = setInterval(async () => {
      try {
        const room = await this.getRoom(code);
        onEvent({ type: 'poll_sync', room });
      } catch {
        // ignore offline poll
      }
    }, 3000);

    return () => {
      if (es) {
        es.close();
      }
      if (this.broadcastChannel) {
        this.broadcastChannel.removeEventListener('message', bcHandler);
      }
      clearInterval(pollInterval);
    };
  }
}

export const api = new ApiService();

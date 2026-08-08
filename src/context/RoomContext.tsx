import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Room, Match, RoomSettings } from '../types';
import { api } from '../services/api';

interface RoomContextType {
  room: Room | null;
  uid: string;
  displayName: string;
  setDisplayName: (name: string) => void;
  isLoading: boolean;
  error: string | null;
  activeMatchPopup: Match | null;
  dismissMatchPopup: () => void;
  createRoom: (name: string, settings?: Partial<RoomSettings>) => Promise<Room>;
  joinRoom: (code: string, name: string) => Promise<Room>;
  refreshRoom: () => Promise<void>;
  updateSettings: (settings: RoomSettings) => Promise<void>;
  startSession: () => Promise<void>;
  submitSwipe: (movieId: number, vote: 'like' | 'pass') => Promise<{ room: Room; newMatch?: Match }>;
  leaveRoom: () => void;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export const RoomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [room, setRoom] = useState<Room | null>(null);
  const [uid, setUid] = useState<string>('');
  const [displayName, setDisplayNameState] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeMatchPopup, setActiveMatchPopup] = useState<Match | null>(null);

  useEffect(() => {
    const initialUid = api.getOrCreateUid();
    setUid(initialUid);
    const savedName = api.getSavedDisplayName();
    setDisplayNameState(savedName);
  }, []);

  const setDisplayName = (name: string) => {
    setDisplayNameState(name);
    api.saveDisplayName(name);
  };

  const dismissMatchPopup = () => {
    setActiveMatchPopup(null);
  };

  // Real-time room subscription
  useEffect(() => {
    if (!room?.roomCode) return;

    const unsubscribe = api.subscribeToRoom(room.roomCode, (event) => {
      if (event.type === 'match_found' && event.payload?.match) {
        setActiveMatchPopup(event.payload.match);
      }
      if (event.room) {
        setRoom(event.room);
      } else if (event.payload?.room) {
        setRoom(event.payload.room);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [room?.roomCode]);

  const refreshRoom = useCallback(async () => {
    if (!room?.roomCode) return;
    try {
      const updated = await api.getRoom(room.roomCode);
      setRoom(updated);
    } catch (e: any) {
      console.error('Failed to refresh room:', e);
    }
  }, [room?.roomCode]);

  const createRoom = async (name: string, settings?: Partial<RoomSettings>): Promise<Room> => {
    setIsLoading(true);
    setError(null);
    try {
      setDisplayName(name);
      const res = await api.createRoom(name, settings);
      setUid(res.uid);
      setRoom(res.room);
      return res.room;
    } catch (err: any) {
      setError(err.message || 'Failed to create room');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const joinRoom = async (code: string, name: string): Promise<Room> => {
    setIsLoading(true);
    setError(null);
    try {
      setDisplayName(name);
      const res = await api.joinRoom(code, name);
      setUid(res.uid);
      setRoom(res.room);
      return res.room;
    } catch (err: any) {
      setError(err.message || 'Failed to join room');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (newSettings: RoomSettings) => {
    if (!room) return;
    setIsLoading(true);
    try {
      const updated = await api.updateSettings(room.roomCode, newSettings);
      setRoom(updated);
    } catch (err: any) {
      setError(err.message || 'Failed to update settings');
    } finally {
      setIsLoading(false);
    }
  };

  const startSession = async () => {
    if (!room) return;
    setIsLoading(true);
    try {
      const updated = await api.startSession(room.roomCode);
      setRoom(updated);
    } catch (err: any) {
      setError(err.message || 'Failed to start session');
    } finally {
      setIsLoading(false);
    }
  };

  const submitSwipe = async (movieId: number, vote: 'like' | 'pass') => {
    if (!room) throw new Error('No active room');
    try {
      const res = await api.submitSwipe(room.roomCode, movieId, vote);
      setRoom(res.room);
      if (res.newMatch) {
        setActiveMatchPopup(res.newMatch);
      }
      return res;
    } catch (err: any) {
      setError(err.message || 'Failed to submit swipe');
      throw err;
    }
  };

  const leaveRoom = () => {
    setRoom(null);
    setActiveMatchPopup(null);
  };

  return (
    <RoomContext.Provider
      value={{
        room,
        uid,
        displayName,
        setDisplayName,
        isLoading,
        error,
        activeMatchPopup,
        dismissMatchPopup,
        createRoom,
        joinRoom,
        refreshRoom,
        updateSettings,
        startSession,
        submitSwipe,
        leaveRoom
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export const useRoom = () => {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error('useRoom must be used within a RoomProvider');
  }
  return context;
};

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoom } from '../context/RoomContext';
import { Film, Users, Sparkles, ArrowRight, Tv, Heart, CheckCircle2 } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { createRoom, joinRoom, displayName, setDisplayName, isLoading, error } = useRoom();

  const [nameInput, setNameInput] = useState(displayName || '');
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');
  const [formError, setFormError] = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) {
      setFormError('Please enter your display name');
      return;
    }
    setFormError(null);
    try {
      const room = await createRoom(nameInput.trim());
      navigate(`/room/${room.roomCode}`);
    } catch (err: any) {
      setFormError(err.message || 'Failed to create room');
    }
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) {
      setFormError('Please enter your display name');
      return;
    }
    if (!roomCodeInput.trim()) {
      setFormError('Please enter a 6-character room code');
      return;
    }
    setFormError(null);
    try {
      const room = await joinRoom(roomCodeInput.trim().toUpperCase(), nameInput.trim());
      navigate(`/room/${room.roomCode}`);
    } catch (err: any) {
      setFormError(err.message || 'Failed to join room');
    }
  };

  return (
    <div className="min-h-[calc(100vh-60px)] flex flex-col items-center justify-center p-4 sm:p-6 bg-[#F9F9F7] text-[#1D1D1F]">
      <div className="w-full max-w-4xl mx-auto space-y-12 py-10">
        {/* Hero Banner */}
        <div className="text-center space-y-5 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-red-50 border border-red-100 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#E1121D]">
            <Sparkles className="w-3.5 h-3.5 text-[#E1121D]" />
            <span>Group Movie Picker</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold text-[#1D1D1F] tracking-tight leading-[1.08]">
            Stop arguing. <br />
            <span className="text-[#E1121D]">
              Start swiping together.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#6E6E73] leading-relaxed max-w-xl mx-auto font-normal">
            Create a room, invite your friends, swipe through movies on your phones, and instantly match on what to watch in under two minutes.
          </p>
        </div>

        {/* Action Box */}
        <div className="w-full max-w-md mx-auto bg-[#F0F0EF] border border-gray-200/80 rounded-[28px] p-6 sm:p-8 apple-shadow-sm relative overflow-hidden">
          {/* Segmented Control Tabs */}
          <div className="flex bg-[#E5E5EA]/70 p-1 rounded-2xl mb-6">
            <button
              onClick={() => { setActiveTab('create'); setFormError(null); }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'create'
                  ? 'bg-[#F9F9F7] text-[#1D1D1F] apple-shadow-sm'
                  : 'text-[#6E6E73] hover:text-[#1D1D1F]'
              }`}
              id="tab-create-room"
            >
              Create New Room
            </button>
            <button
              onClick={() => { setActiveTab('join'); setFormError(null); }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'join'
                  ? 'bg-[#F9F9F7] text-[#1D1D1F] apple-shadow-sm'
                  : 'text-[#6E6E73] hover:text-[#1D1D1F]'
              }`}
              id="tab-join-room"
            >
              Join Existing Room
            </button>
          </div>

          {(formError || error) && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200/60 text-[#E1121D] text-xs font-medium text-center">
              {formError || error}
            </div>
          )}

          {activeTab === 'create' ? (
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#6E6E73]">
                  Your Display Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Alex"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#F9F9F7] border border-gray-200/80 text-[#1D1D1F] placeholder-gray-400 text-sm font-medium focus:outline-none focus:bg-white focus:border-[#E1121D] transition-all"
                  maxLength={20}
                  required
                  id="create-display-name-input"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-6 rounded-xl bg-[#E1121D] hover:bg-[#B80012] text-white font-bold text-sm shadow-xs flex items-center justify-center gap-2 transition-transform active:scale-[0.98] disabled:opacity-50"
                id="create-room-submit-btn"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Film className="w-4 h-4" />
                    <span>Create Room & Set Filters</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleJoin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#6E6E73]">
                  Your Display Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sam"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#F9F9F7] border border-gray-200/80 text-[#1D1D1F] placeholder-gray-400 text-sm font-medium focus:outline-none focus:bg-white focus:border-[#E1121D] transition-all"
                  maxLength={20}
                  required
                  id="join-display-name-input"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#6E6E73]">
                  6-Character Room Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. X7K2M9"
                  value={roomCodeInput}
                  onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 rounded-xl bg-[#F9F9F7] border border-gray-200/80 text-[#1D1D1F] placeholder-gray-400 text-sm font-mono font-bold tracking-widest text-center uppercase focus:outline-none focus:bg-white focus:border-[#E1121D] transition-all"
                  maxLength={6}
                  required
                  id="join-room-code-input"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-6 rounded-xl bg-[#1D1D1F] hover:bg-black text-white font-bold text-sm shadow-xs flex items-center justify-center gap-2 transition-transform active:scale-[0.98] disabled:opacity-50"
                id="join-room-submit-btn"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Users className="w-4 h-4" />
                    <span>Join Room</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* How It Works Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-200/60">
          <div className="bg-[#F0F0EF] p-6 rounded-2xl border border-gray-200/60 apple-shadow-sm space-y-3">
            <div className="w-8 h-8 rounded-xl bg-red-50 text-[#E1121D] flex items-center justify-center font-bold text-sm border border-red-100">
              1
            </div>
            <h3 className="font-bold text-base text-[#1D1D1F]">Create or Join Room</h3>
            <p className="text-xs text-[#6E6E73] leading-relaxed">
              One person creates the room code and configures streaming services or genre filters.
            </p>
          </div>

          <div className="bg-[#F0F0EF] p-6 rounded-2xl border border-gray-200/60 apple-shadow-sm space-y-3">
            <div className="w-8 h-8 rounded-xl bg-red-50 text-[#E1121D] flex items-center justify-center font-bold text-sm border border-red-100">
              2
            </div>
            <h3 className="font-bold text-base text-[#1D1D1F]">Swipe Individually</h3>
            <p className="text-xs text-[#6E6E73] leading-relaxed">
              Everyone swipes right for movies they want to watch, or left to pass.
            </p>
          </div>

          <div className="bg-[#F0F0EF] p-6 rounded-2xl border border-gray-200/60 apple-shadow-sm space-y-3">
            <div className="w-8 h-8 rounded-xl bg-red-50 text-[#E1121D] flex items-center justify-center font-bold text-sm border border-red-100">
              3
            </div>
            <h3 className="font-bold text-base text-[#1D1D1F]">Instant Real-Time Matches</h3>
            <p className="text-xs text-[#6E6E73] leading-relaxed">
              When everyone likes the same movie, a match celebration pops up with exact streaming platforms!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

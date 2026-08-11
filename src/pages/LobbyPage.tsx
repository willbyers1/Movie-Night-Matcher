import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRoom } from '../context/RoomContext';
import { POPULAR_GENRES, POPULAR_PROVIDERS } from '../services/mockTmdbData';
import { MatchThreshold, Member } from '../types';
import { Users, Copy, Check, Share2, Sparkles, Sliders, Play, Shield, Globe, Film, Star, CheckCircle2 } from 'lucide-react';

export const LobbyPage: React.FC = () => {
  const { roomCode } = useParams<{ roomCode: string }>();
  const navigate = useNavigate();
  const { room, uid, joinRoom, updateSettings, startSession, isLoading } = useRoom();

  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [joinNameInput, setJoinNameInput] = useState('');
  const [showJoinModal, setShowJoinModal] = useState(false);

  // Filter state for host editing
  const [selectedGenres, setSelectedGenres] = useState<number[]>(room?.settings.selectedGenres || []);
  const [minRating, setMinRating] = useState<number>(room?.settings.minRating || 6.0);
  const [yearMin, setYearMin] = useState<number>(room?.settings.yearRange?.[0] || 1990);
  const [yearMax, setYearMax] = useState<number>(room?.settings.yearRange?.[1] || 2026);
  const [selectedProviders, setSelectedProviders] = useState<number[]>(room?.settings.selectedProviders || []);
  const [matchThreshold, setMatchThreshold] = useState<MatchThreshold>(room?.settings.matchThreshold || 'everyone');
  const [region, setRegion] = useState<string>(room?.settings.region || 'US');
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  useEffect(() => {
    if (room) {
      setSelectedGenres(room.settings.selectedGenres || []);
      setMinRating(room.settings.minRating || 6.0);
      setYearMin(room.settings.yearRange?.[0] || 1990);
      setYearMax(room.settings.yearRange?.[1] || 2026);
      setSelectedProviders(room.settings.selectedProviders || []);
      setMatchThreshold(room.settings.matchThreshold || 'everyone');
      setRegion(room.settings.region || 'US');

      if (room.status === 'active') {
        navigate(`/room/${room.roomCode}/swipe`);
      }
    }
  }, [room, navigate]);

  // If user opened link directly without joining state
  useEffect(() => {
    if (roomCode && (!room || room.roomCode !== roomCode.toUpperCase())) {
      setShowJoinModal(true);
    } else {
      setShowJoinModal(false);
    }
  }, [roomCode, room]);

  const handleJoinByLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomCode || !joinNameInput.trim()) return;
    try {
      await joinRoom(roomCode.toUpperCase(), joinNameInput.trim());
      setShowJoinModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (!room || showJoinModal) {
    return (
      <div className="min-h-[calc(100vh-60px)] flex items-center justify-center p-4 bg-[#F9F9F7] text-[#1D1D1F]">
        <div className="w-full max-w-md bg-[#F0F0EF] border border-gray-200/80 rounded-[28px] p-6 sm:p-8 apple-shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#E1121D] mx-auto flex items-center justify-center text-white apple-shadow-sm">
              <Film className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-[#1D1D1F]">
              Join Room <span className="text-[#E1121D] font-mono">{roomCode?.toUpperCase()}</span>
            </h2>
            <p className="text-xs text-[#6E6E73]">
              Enter your display name to join your friends!
            </p>
          </div>

          <form onSubmit={handleJoinByLink} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#6E6E73]">
                Your Display Name
              </label>
              <input
                type="text"
                placeholder="e.g. Jordan"
                value={joinNameInput}
                onChange={(e) => setJoinNameInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#F9F9F7] border border-gray-200/80 text-[#1D1D1F] placeholder-gray-400 text-sm font-medium focus:outline-none focus:bg-white focus:border-[#E1121D] transition-all"
                maxLength={20}
                required
                id="link-join-name-input"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 rounded-xl bg-[#E1121D] hover:bg-[#B80012] text-white font-bold text-sm shadow-xs flex items-center justify-center gap-2 transition-transform active:scale-[0.98] disabled:opacity-50"
              id="link-join-submit-btn"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Users className="w-4 h-4" />
                  <span>Join Room Lobby</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const membersList = Object.values(room.members) as Member[];
  const isHost = room.hostUid === uid;
  const canStart = membersList.length >= 1; // Can start with 1+ or 2+

  const handleCopyCode = () => {
    navigator.clipboard.writeText(room.roomCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/room/${room.roomCode}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const toggleGenre = (genreId: number) => {
    setSelectedGenres(prev =>
      prev.includes(genreId) ? prev.filter(g => g !== genreId) : [...prev, genreId]
    );
  };

  const toggleProvider = (providerId: number) => {
    setSelectedProviders(prev =>
      prev.includes(providerId) ? prev.filter(p => p !== providerId) : [...prev, providerId]
    );
  };

  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    await updateSettings({
      selectedGenres,
      yearRange: [yearMin, yearMax],
      minRating,
      selectedProviders,
      matchThreshold,
      region,
      movieCount: 30
    });
    setIsSavingSettings(false);
  };

  const handleStartSession = async () => {
    if (isHost) {
      await handleSaveSettings();
    }
    await startSession();
    navigate(`/room/${room.roomCode}/swipe`);
  };

  return (
    <div className="min-h-[calc(100vh-60px)] p-4 sm:p-8 bg-[#F9F9F7] text-[#1D1D1F]">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Lobby Header */}
        <div className="bg-[#F0F0EF] border border-gray-200/80 rounded-[28px] p-6 sm:p-8 apple-shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-red-50 text-[#E1121D] border border-red-100 px-3 py-1 rounded-full text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Room Lobby</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1D1D1F]">
              Room Code: <span className="font-mono text-[#E1121D]">{room.roomCode}</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#6E6E73] max-w-lg">
              Share this code or link with your friends so they can join on their own screens!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-center">
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-2 bg-[#F9F9F7] hover:bg-[#E5E5EA] text-[#1D1D1F] px-4 py-2.5 rounded-xl border border-gray-200/80 text-xs font-semibold transition-all active:scale-[0.98]"
              id="copy-code-lobby-btn"
            >
              {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copiedCode ? 'Code Copied!' : 'Copy Code'}</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="flex items-center gap-2 bg-[#E1121D] hover:bg-[#B80012] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-[0.98] shadow-xs"
              id="copy-link-lobby-btn"
            >
              {copiedLink ? <Check className="w-4 h-4 text-white" /> : <Share2 className="w-4 h-4" />}
              <span>{copiedLink ? 'Link Copied!' : 'Share Room Link'}</span>
            </button>
          </div>
        </div>

        {/* Main Grid: Participants & Filter Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Members Column */}
          <div className="bg-[#F0F0EF] border border-gray-200/80 rounded-[28px] p-6 space-y-5 h-fit apple-shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200/60">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-700" />
                <h3 className="font-bold text-base text-[#1D1D1F]">Participants</h3>
              </div>
              <span className="text-xs font-bold bg-[#F9F9F7] text-[#1D1D1F] px-2.5 py-1 rounded-full border border-gray-200/60">
                {membersList.length} Joined
              </span>
            </div>

            <div className="space-y-2.5">
              {membersList.map((m) => (
                <div
                  key={m.uid}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F9F9F7] border border-gray-200/60"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#1D1D1F] text-white font-bold text-sm flex items-center justify-center apple-shadow-sm">
                      {m.displayName[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#1D1D1F] flex items-center gap-1.5">
                        <span>{m.displayName}</span>
                        {m.uid === uid && (
                          <span className="text-[10px] text-[#6E6E73] bg-gray-200/80 px-1.5 py-0.2 rounded font-medium">
                            (You)
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-emerald-600 flex items-center gap-1 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Ready in Lobby
                      </span>
                    </div>
                  </div>

                  {m.isHost && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200/80">
                      <Shield className="w-3 h-3 text-amber-600" />
                      Host
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Start Button */}
            <div className="pt-4 border-t border-gray-200/60 space-y-2">
              <button
                onClick={handleStartSession}
                disabled={!canStart}
                className="w-full py-4 px-6 rounded-2xl bg-[#E1121D] hover:bg-[#B80012] text-white font-bold text-sm shadow-xs flex items-center justify-center gap-2 transition-transform active:scale-[0.98] disabled:opacity-50"
                id="start-swiping-btn"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>Start Swiping Now</span>
              </button>

              {membersList.length < 2 && (
                <p className="text-[11px] text-[#6E6E73] text-center italic">
                  💡 Tip: Share the room code so friends can swipe with you!
                </p>
              )}
            </div>
          </div>

          {/* Session Settings Column */}
          <div className="lg:col-span-2 bg-[#F0F0EF] border border-gray-200/80 rounded-[28px] p-6 sm:p-8 space-y-6 apple-shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200/60">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#E1121D]" />
                <div>
                  <h3 className="font-bold text-base text-[#1D1D1F]">Session Filters</h3>
                  <p className="text-xs text-[#6E6E73]">
                    {isHost ? 'Configure movie criteria for your group' : 'Configured by Host'}
                  </p>
                </div>
              </div>

              {isHost && (
                <button
                  onClick={handleSaveSettings}
                  disabled={isSavingSettings}
                  className="px-3 py-1.5 rounded-xl bg-[#F9F9F7] hover:bg-[#E5E5EA] text-[#1D1D1F] text-xs font-semibold border border-gray-200/80 transition-colors"
                  id="save-filters-btn"
                >
                  {isSavingSettings ? 'Saving...' : 'Apply Filters'}
                </button>
              )}
            </div>

            {/* Match Threshold Setting */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#6E6E73] flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-gray-600" />
                Match Rule
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { key: 'everyone', label: 'Everyone Must Agree', desc: '100% group match' },
                  { key: 'majority', label: 'Majority Match', desc: '>50% of members' },
                  { key: 'threshold_2', label: 'At Least 2 People', desc: 'Min 2 likes' }
                ].map((t) => (
                  <button
                    key={t.key}
                    disabled={!isHost}
                    onClick={() => setMatchThreshold(t.key as MatchThreshold)}
                    className={`p-3 rounded-2xl text-left border transition-all ${
                      matchThreshold === t.key
                        ? 'bg-red-50 border-[#E1121D] text-[#E1121D]'
                        : 'bg-[#F9F9F7] border-gray-200/60 text-[#6E6E73] hover:text-[#1D1D1F]'
                    }`}
                  >
                    <div className={`text-xs font-bold ${matchThreshold === t.key ? 'text-[#E1121D]' : 'text-[#1D1D1F]'}`}>{t.label}</div>
                    <div className="text-[10px] text-[#6E6E73] mt-0.5">{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Genres */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#6E6E73] flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5 text-[#E1121D]" />
                Genres ({selectedGenres.length === 0 ? 'All Genres' : `${selectedGenres.length} selected`})
              </label>
              <div className="flex flex-wrap gap-2">
                {POPULAR_GENRES.map((g) => {
                  const isSelected = selectedGenres.includes(g.id);
                  return (
                    <button
                      key={g.id}
                      disabled={!isHost}
                      onClick={() => toggleGenre(g.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        isSelected
                          ? 'bg-[#E1121D] text-white border-[#E1121D] apple-shadow-xs'
                          : 'bg-[#F9F9F7] text-[#6E6E73] border-gray-200/60 hover:text-[#1D1D1F]'
                      }`}
                    >
                      {g.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Min Rating & Years */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-[#6E6E73] uppercase tracking-wider">
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-500" />
                    Min Rating
                  </span>
                  <span className="text-[#1D1D1F] font-bold">{minRating.toFixed(1)}+</span>
                </div>
                <input
                  type="range"
                  min="5.0"
                  max="8.5"
                  step="0.5"
                  disabled={!isHost}
                  value={minRating}
                  onChange={(e) => setMinRating(parseFloat(e.target.value))}
                  className="w-full accent-[#E1121D] cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-[#6E6E73] uppercase tracking-wider">
                  <span>Release Years</span>
                  <span className="text-[#1D1D1F] font-bold">{yearMin} - {yearMax}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1970"
                    max="2026"
                    disabled={!isHost}
                    value={yearMin}
                    onChange={(e) => setYearMin(parseInt(e.target.value, 10) || 1990)}
                    className="w-full px-3 py-1.5 rounded-xl bg-[#F9F9F7] border border-gray-200/80 text-xs font-bold text-[#1D1D1F] text-center focus:bg-white focus:outline-none"
                  />
                  <span className="text-[#6E6E73] text-xs">to</span>
                  <input
                    type="number"
                    min="1970"
                    max="2026"
                    disabled={!isHost}
                    value={yearMax}
                    onChange={(e) => setYearMax(parseInt(e.target.value, 10) || 2026)}
                    className="w-full px-3 py-1.5 rounded-xl bg-[#F9F9F7] border border-gray-200/80 text-xs font-bold text-[#1D1D1F] text-center focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Streaming Services */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#6E6E73] flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-600" />
                Include Streaming Services
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {POPULAR_PROVIDERS.map((p) => {
                  const isSelected = selectedProviders.includes(p.provider_id);
                  return (
                    <button
                      key={p.provider_id}
                      disabled={!isHost}
                      onClick={() => toggleProvider(p.provider_id)}
                      className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-[#F9F9F7] text-[#6E6E73] border-gray-200/60 hover:text-[#1D1D1F]'
                      }`}
                    >
                      <img src={p.logo_path} alt={p.provider_name} className="w-5 h-5 rounded-md object-cover" />
                      <span className="truncate">{p.provider_name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

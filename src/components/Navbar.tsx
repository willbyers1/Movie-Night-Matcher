import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Film, Users, Sparkles, Copy, Check, LogOut, Share2, Heart } from 'lucide-react';
import { Member } from '../types';
import { useRoom } from '../context/RoomContext';

export const Navbar: React.FC = () => {
  const { room, uid, leaveRoom } = useRoom();
  const navigate = useNavigate();
  const location = useLocation();
  const [copied, setCopied] = useState(false);

  if (!room) {
    return (
      <header className="sticky top-0 z-30 bg-[#F9F9F7]/85 backdrop-blur-md border-b border-gray-200/50 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2.5 cursor-pointer group"
            id="brand-logo"
          >
            <div className="w-8 h-8 rounded-xl bg-[#E1121D] flex items-center justify-center text-white apple-shadow-sm group-hover:scale-105 transition-transform">
              <Film className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg text-[#1D1D1F] tracking-tight">
                Movie Night
              </span>
              <span className="text-xs font-medium text-[#E1121D] bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
                Matcher
              </span>
            </div>
          </div>
          <div className="text-xs text-[#6E6E73] font-normal hidden sm:block">
            Swipe. Match. Watch Together.
          </div>
        </div>
      </header>
    );
  }

  const activeMembersCount = (Object.values(room.members) as Member[]).filter(m => m.isActive).length;
  const matchCount = Object.keys(room.matches || {}).length;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(room.roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/room/${room.roomCode}`;
    if (navigator.share) {
      navigator.share({
        title: 'Join Movie Night Matcher Room',
        text: `Join room ${room.roomCode} to pick what we watch!`,
        url: shareUrl
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isSwipePage = location.pathname.includes('/swipe');
  const isMatchesPage = location.pathname.includes('/matches');

  return (
    <header className="sticky top-0 z-30 bg-[#F9F9F7]/85 backdrop-blur-md border-b border-gray-200/50 px-4 py-2.5">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        {/* Brand logo & Room Code */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2 cursor-pointer group"
            id="nav-brand"
          >
            <div className="w-8 h-8 rounded-xl bg-[#E1121D] flex items-center justify-center text-white apple-shadow-sm group-hover:scale-105 transition-transform">
              <Film className="w-4 h-4" />
            </div>
            <span className="font-bold text-base text-[#1D1D1F] tracking-tight hidden md:inline">Movie Night</span>
          </div>

          <div className="flex items-center gap-1.5 bg-[#F0F0EF] border border-gray-200/60 px-3 py-1 rounded-full text-xs">
            <span className="text-[#6E6E73] font-medium">Room:</span>
            <span className="font-mono font-bold text-[#E1121D] tracking-wider text-sm">{room.roomCode}</span>
            <button
              onClick={handleCopyCode}
              className="p-0.5 text-[#6E6E73] hover:text-[#1D1D1F] transition-colors ml-0.5"
              title="Copy Room Code"
              id="copy-code-btn"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {room.status === 'active' && (
            <>
              <button
                onClick={() => navigate(`/room/${room.roomCode}/swipe`)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isSwipePage
                    ? 'bg-[#E1121D] text-white shadow-xs'
                    : 'text-[#6E6E73] hover:bg-[#F0F0EF] hover:text-[#1D1D1F]'
                }`}
                id="nav-swipe-tab"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Swipe</span>
              </button>

              <button
                onClick={() => navigate(`/room/${room.roomCode}/matches`)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all relative ${
                  isMatchesPage
                    ? 'bg-[#1D1D1F] text-white shadow-xs'
                    : 'text-[#6E6E73] hover:bg-[#F0F0EF] hover:text-[#1D1D1F]'
                }`}
                id="nav-matches-tab"
              >
                <Heart className={`w-3.5 h-3.5 ${isMatchesPage ? 'fill-white' : 'fill-gray-400 text-gray-400'}`} />
                <span>Matches</span>
                {matchCount > 0 && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-4 text-center ${
                    isMatchesPage ? 'bg-white text-[#1D1D1F]' : 'bg-[#E1121D] text-white'
                  }`}>
                    {matchCount}
                  </span>
                )}
              </button>
            </>
          )}

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#6E6E73] bg-[#F0F0EF] px-3 py-1 rounded-full border border-gray-200/60">
            <Users className="w-3.5 h-3.5 text-gray-500" />
            <span className="font-semibold text-[#1D1D1F]">{activeMembersCount}</span>
            <span className="text-[#6E6E73]">joined</span>
          </div>

          <button
            onClick={handleShare}
            className="p-2 rounded-full text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#F0F0EF] transition-colors"
            title="Share Room Link"
            id="share-btn"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              leaveRoom();
              navigate('/');
            }}
            className="p-2 rounded-full text-[#6E6E73] hover:text-[#E1121D] hover:bg-red-50 transition-colors"
            title="Leave Room"
            id="leave-room-btn"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

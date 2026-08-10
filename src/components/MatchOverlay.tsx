import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Match } from '../types';
import { useRoom } from '../context/RoomContext';
import { Heart, Sparkles, Tv, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MatchOverlayProps {
  match: Match | null;
  onClose: () => void;
}

export const MatchOverlay: React.FC<MatchOverlayProps> = ({ match, onClose }) => {
  const { room, uid } = useRoom();
  const navigate = useNavigate();

  useEffect(() => {
    if (match) {
      // Trigger confetti fireworks
      const count = 200;
      const defaults = { origin: { y: 0.6 } };

      function fire(particleRatio: number, opts: confetti.Options) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio)
        });
      }

      fire(0.25, { spread: 26, startVelocity: 55, colors: ['#f43f5e', '#ec4899', '#8b5cf6'] });
      fire(0.2, { spread: 60, colors: ['#3b82f6', '#10b981', '#f59e0b'] });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, colors: ['#e11d48', '#fb7185'] });
      fire(0.1, { spread: 120, startVelocity: 45 });
    }
  }, [match]);

  if (!match) return null;

  const movie = match.movieSnapshot;
  const matchedMembers = match.matchedUids.map(uId => {
    return room?.members[uId]?.displayName || (uId === uid ? 'You' : 'Friend');
  });

  const handleGoToMatches = () => {
    onClose();
    if (room) {
      navigate(`/room/${room.roomCode}/matches`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-[#F0F0EF] border border-gray-200/80 rounded-[28px] apple-shadow-lg overflow-hidden p-6 sm:p-8 text-center space-y-6 text-[#1D1D1F]"
        id="match-celebration-card"
      >
        {/* Header Badge & Title */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 bg-red-50 text-[#E1121D] border border-red-100 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <Heart className="w-4 h-4 fill-[#E1121D]" />
            <span>It's a Match!</span>
            <Sparkles className="w-4 h-4" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F]">
            Everyone Wants to Watch This!
          </h2>
          <p className="text-xs sm:text-sm text-[#6E6E73]">
            Matched by: <span className="text-[#1D1D1F] font-bold">{matchedMembers.join(', ')}</span>
          </p>
        </div>

        {/* Movie Poster & Details */}
        <div className="relative mx-auto w-48 h-72 sm:w-52 sm:h-76 rounded-2xl overflow-hidden apple-shadow-md border border-gray-200/80 group">
          {movie.poster_path ? (
            <img
              src={movie.poster_path}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-[#F5F5F7] flex items-center justify-center text-gray-500 font-semibold p-4">
              {movie.title}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 text-left text-white">
            <span className="text-black font-bold text-xs bg-amber-400 px-2 py-0.5 rounded-md">
              ★ {movie.vote_average.toFixed(1)}
            </span>
            <h3 className="text-base font-bold text-white mt-1 line-clamp-1">{movie.title}</h3>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2.5 pt-2">
          <button
            onClick={handleGoToMatches}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#E1121D] hover:bg-[#B80012] text-white font-bold text-sm shadow-xs flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
            id="view-match-providers-btn"
          >
            <Tv className="w-4 h-4" />
            <span>View Streaming Options</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>

          <button
            onClick={onClose}
            className="w-full py-3 px-6 rounded-2xl bg-[#F5F5F7] hover:bg-[#E5E5EA] text-[#1D1D1F] font-semibold text-xs transition-colors"
            id="keep-swiping-btn"
          >
            Keep Swiping for More
          </button>
        </div>
      </div>
    </div>
  );
};

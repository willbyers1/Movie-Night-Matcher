import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRoom } from '../context/RoomContext';
import { SwipeCard } from '../components/SwipeCard';
import { MovieDetailModal } from '../components/MovieDetailModal';
import { Movie, Member } from '../types';
import { Heart, X, Info, Sparkles, Users, CheckCircle2, RefreshCw } from 'lucide-react';

export const SwipePage: React.FC = () => {
  const { roomCode } = useParams<{ roomCode: string }>();
  const navigate = useNavigate();
  const { room, uid, submitSwipe } = useRoom();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedMovieForDetails, setSelectedMovieForDetails] = useState<Movie | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);

  useEffect(() => {
    if (room && uid) {
      const userSwipes = room.swipes[uid] || [];
      // Set currentIndex to first movie user hasn't swiped yet
      const swipedMovieIds = new Set(userSwipes.map(s => s.movieId));
      const nextUnswipedIndex = room.movies.findIndex(m => !swipedMovieIds.has(m.id));
      if (nextUnswipedIndex >= 0) {
        setCurrentIndex(nextUnswipedIndex);
      } else if (userSwipes.length >= room.movies.length && room.movies.length > 0) {
        setCurrentIndex(room.movies.length);
      }
    }
  }, [room?.roomCode, uid]);

  const handleVote = useCallback(async (vote: 'like' | 'pass') => {
    if (!room || isSwiping) return;
    const currentMovie = room.movies[currentIndex];
    if (!currentMovie) return;

    setIsSwiping(true);
    try {
      await submitSwipe(currentMovie.id, vote);
      setCurrentIndex(prev => prev + 1);
    } catch (err) {
      console.error('Swipe error:', err);
    } finally {
      setIsSwiping(false);
    }
  }, [room, currentIndex, isSwiping, submitSwipe]);

  // Keyboard shortcut support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedMovieForDetails) return; // Ignore if modal is open
      if (e.key === 'ArrowLeft') {
        handleVote('pass');
      } else if (e.key === 'ArrowRight') {
        handleVote('like');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleVote, selectedMovieForDetails]);

  if (!room) {
    return (
      <div className="min-h-[calc(100vh-60px)] flex flex-col items-center justify-center p-4 bg-[#F9F9F7] text-[#1D1D1F]">
        <div className="w-8 h-8 border-4 border-[#E1121D] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm text-[#6E6E73]">Loading room session...</p>
      </div>
    );
  }

  const movies = room.movies || [];
  const currentMovie = movies[currentIndex];
  const nextMovie = movies[currentIndex + 1];
  const isFinished = currentIndex >= movies.length;

  const matchesCount = Object.keys(room.matches || {}).length;
  const activeMembersList = (Object.values(room.members) as Member[]).filter(m => m.isActive);

  return (
    <div className="min-h-[calc(100vh-60px)] flex flex-col items-center justify-between p-4 sm:p-6 bg-[#F9F9F7] text-[#1D1D1F] overflow-hidden relative">
      {/* Top Header Progress Bar */}
      <div className="w-full max-w-md mx-auto space-y-2.5 z-10">
        <div className="flex items-center justify-between text-xs font-semibold text-[#6E6E73]">
          <div className="flex items-center gap-1.5 text-[#1D1D1F]">
            <Sparkles className="w-3.5 h-3.5 text-[#E1121D]" />
            <span>Movie {Math.min(currentIndex + 1, movies.length)} of {movies.length}</span>
          </div>

          <button
            onClick={() => navigate(`/room/${room.roomCode}/matches`)}
            className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100/80 text-[#E1121D] border border-red-100 px-3 py-1 rounded-full text-xs font-bold transition-all shadow-xs"
            id="view-matches-header-btn"
          >
            <Heart className="w-3.5 h-3.5 fill-[#E1121D] text-[#E1121D]" />
            <span>{matchesCount} {matchesCount === 1 ? 'Match' : 'Matches'}</span>
          </button>
        </div>

        {/* Progress bar line */}
        <div className="w-full h-1.5 bg-[#E5E5EA] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#E1121D] transition-all duration-300"
            style={{ width: `${movies.length > 0 ? (Math.min(currentIndex, movies.length) / movies.length) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Main Swiping Container */}
      <div className="relative w-full max-w-md h-[500px] sm:h-[560px] my-4 flex items-center justify-center">
        {!isFinished && currentMovie ? (
          <>
            {/* Background next card for depth preview */}
            {nextMovie && (
              <SwipeCard
                key={nextMovie.id}
                movie={nextMovie}
                onSwipe={() => {}}
                onOpenDetails={() => {}}
                isFront={false}
              />
            )}

            {/* Active Front Card */}
            <SwipeCard
              key={currentMovie.id}
              movie={currentMovie}
              onSwipe={handleVote}
              onOpenDetails={setSelectedMovieForDetails}
              isFront={true}
            />
          </>
        ) : (
          /* Finished Swiping Screen */
          <div className="w-full h-full rounded-[28px] bg-[#F0F0EF] border border-gray-200/80 p-8 flex flex-col items-center justify-center text-center space-y-6 apple-shadow-sm">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-[#1D1D1F]">All Caught Up!</h2>
              <p className="text-xs sm:text-sm text-[#6E6E73] max-w-xs leading-relaxed">
                You've swiped through all selected movie suggestions in this batch.
              </p>
            </div>

            {/* Active Friends Status */}
            <div className="w-full bg-[#F9F9F7] p-4 rounded-2xl border border-gray-200/60 text-left space-y-2">
              <div className="text-xs font-bold text-[#1D1D1F] flex items-center justify-between">
                <span>Group Status</span>
                <span className="text-[#0071E3] text-[11px] font-medium">Real-time</span>
              </div>
              <div className="space-y-1.5">
                {activeMembersList.map(m => {
                  const isUser = m.uid === uid;
                  const swipedCount = room.swipes[m.uid]?.length || 0;
                  const isDone = swipedCount >= movies.length;
                  return (
                    <div key={m.uid} className="flex items-center justify-between text-xs py-1 border-b border-gray-200/40 last:border-0">
                      <span className="font-medium text-[#1D1D1F]">
                        {m.displayName} {isUser && '(You)'}
                      </span>
                      <span className={`text-[11px] font-bold ${isDone ? 'text-emerald-600' : 'text-amber-700'}`}>
                        {isDone ? 'Finished' : `Swiping (${swipedCount}/${movies.length})`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => navigate(`/room/${room.roomCode}/matches`)}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#E1121D] hover:bg-[#B80012] text-white font-bold text-sm shadow-xs flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
              id="view-matches-finished-btn"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>View Group Matches ({matchesCount})</span>
            </button>
          </div>
        )}
      </div>

      {/* Bottom Control Buttons (Pass, Info, Like) */}
      {!isFinished && currentMovie && (
        <div className="w-full max-w-md mx-auto flex items-center justify-center gap-6 z-10 pb-2">
          {/* Pass Button */}
          <button
            onClick={() => handleVote('pass')}
            disabled={isSwiping}
            className="w-16 h-16 rounded-full bg-[#F0F0EF] hover:bg-red-50 text-[#E1121D] border border-gray-200/80 flex items-center justify-center apple-shadow-sm transition-transform active:scale-90"
            title="Pass (Left Arrow)"
            id="button-pass"
          >
            <X className="w-8 h-8 stroke-[2.5]" />
          </button>

          {/* Info Button */}
          <button
            onClick={() => setSelectedMovieForDetails(currentMovie)}
            className="w-12 h-12 rounded-full bg-[#F0F0EF] hover:bg-[#E5E5EA] text-[#1D1D1F] border border-gray-200/80 flex items-center justify-center apple-shadow-sm transition-transform active:scale-90"
            title="Movie Details"
            id="button-info"
          >
            <Info className="w-6 h-6" />
          </button>

          {/* Like Button */}
          <button
            onClick={() => handleVote('like')}
            disabled={isSwiping}
            className="w-16 h-16 rounded-full bg-[#E1121D] hover:bg-[#B80012] text-white flex items-center justify-center apple-shadow transition-transform active:scale-90"
            title="Like (Right Arrow)"
            id="button-like"
          >
            <Heart className="w-8 h-8 fill-white" />
          </button>
        </div>
      )}

      {/* Movie Details Modal */}
      {selectedMovieForDetails && (
        <MovieDetailModal
          movie={selectedMovieForDetails}
          onClose={() => setSelectedMovieForDetails(null)}
          region={room.settings.region || 'US'}
        />
      )}
    </div>
  );
};

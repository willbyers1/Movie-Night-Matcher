import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRoom } from '../context/RoomContext';
import { StreamingProviders } from '../components/StreamingProviders';
import { MovieDetailModal } from '../components/MovieDetailModal';
import { Movie, Match } from '../types';
import { Heart, Sparkles, ArrowLeft, Tv, Star, Users, Info, Calendar } from 'lucide-react';

export const MatchesPage: React.FC = () => {
  const { roomCode } = useParams<{ roomCode: string }>();
  const navigate = useNavigate();
  const { room, uid } = useRoom();

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  if (!room) {
    return (
      <div className="min-h-[calc(100vh-60px)] flex flex-col items-center justify-center p-4 bg-[#F9F9F7] text-[#1D1D1F]">
        <p className="text-sm text-[#6E6E73]">Loading room matches...</p>
      </div>
    );
  }

  const matchesList: Match[] = (Object.values(room.matches || {}) as Match[]).sort((a, b) => b.matchedAt - a.matchedAt);

  return (
    <div className="min-h-[calc(100vh-60px)] p-4 sm:p-8 bg-[#F9F9F7] text-[#1D1D1F]">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-200/80">
          <div className="space-y-1">
            <button
              onClick={() => navigate(`/room/${room.roomCode}/swipe`)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6E6E73] hover:text-[#1D1D1F] mb-2 transition-colors"
              id="back-to-swipe-btn"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Swiping</span>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#E1121D] flex items-center justify-center text-white apple-shadow-sm">
                <Heart className="w-4 h-4 fill-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F]">
                Group Matches ({matchesList.length})
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[#6E6E73]">
              Movies that all or required members in <span className="font-mono text-[#E1121D] font-bold">{room.roomCode}</span> agreed on!
            </p>
          </div>

          <button
            onClick={() => navigate(`/room/${room.roomCode}/swipe`)}
            className="py-2.5 px-5 rounded-xl bg-[#E1121D] hover:bg-[#B80012] text-white font-bold text-xs shadow-xs flex items-center gap-2 transition-transform active:scale-[0.98]"
            id="continue-swiping-matches-btn"
          >
            <Sparkles className="w-4 h-4" />
            <span>Keep Swiping</span>
          </button>
        </div>

        {/* Empty Matches State */}
        {matchesList.length === 0 ? (
          <div className="bg-[#F0F0EF] border border-gray-200/80 rounded-[28px] p-12 text-center space-y-4 max-w-md mx-auto my-12 apple-shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-red-50 text-[#E1121D] mx-auto flex items-center justify-center border border-red-100">
              <Heart className="w-8 h-8 fill-[#E1121D]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-[#1D1D1F]">No Matches Yet</h3>
              <p className="text-xs text-[#6E6E73] leading-relaxed">
                Keep swiping through suggestions! When group members like the same movie, it will instantly appear here with full streaming provider options.
              </p>
            </div>
            <button
              onClick={() => navigate(`/room/${room.roomCode}/swipe`)}
              className="py-3 px-6 rounded-xl bg-[#E1121D] hover:bg-[#B80012] text-white font-bold text-xs shadow-xs"
            >
              Start Swiping
            </button>
          </div>
        ) : (
          /* Match Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {matchesList.map((match) => {
              const movie = match.movieSnapshot;
              const matchedMemberNames = match.matchedUids.map(
                uId => room.members[uId]?.displayName || (uId === uid ? 'You' : 'Friend')
              );
              const year = movie.release_date ? movie.release_date.substring(0, 4) : 'N/A';

              return (
                <div
                  key={match.movieId}
                  className="bg-[#F0F0EF] border border-gray-200/80 rounded-[28px] overflow-hidden apple-shadow-sm flex flex-col justify-between hover:apple-shadow-md transition-all"
                  id={`match-card-${match.movieId}`}
                >
                  <div className="p-5 space-y-4">
                    {/* Top Movie Header */}
                    <div className="flex gap-4">
                      {movie.poster_path && (
                        <img
                          src={movie.poster_path}
                          alt={movie.title}
                          className="w-20 h-28 sm:w-24 sm:h-36 rounded-2xl object-cover border border-gray-200/80 shadow-xs flex-shrink-0 cursor-pointer"
                          onClick={() => setSelectedMovie(movie)}
                        />
                      )}
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-xs font-semibold">
                          <span className="flex items-center gap-1 text-black font-bold bg-amber-400 px-2 py-0.5 rounded-md shadow-xs">
                            <Star className="w-3 h-3 fill-black" />
                            <span>{movie.vote_average.toFixed(1)}</span>
                          </span>
                          <span className="flex items-center gap-1 text-[#6E6E73]">
                            <Calendar className="w-3 h-3" />
                            <span>{year}</span>
                          </span>
                        </div>

                        <h3 
                          className="text-lg font-bold text-[#1D1D1F] hover:text-[#E1121D] cursor-pointer transition-colors truncate"
                          onClick={() => setSelectedMovie(movie)}
                        >
                          {movie.title}
                        </h3>

                        <p className="text-xs text-[#6E6E73] line-clamp-2 leading-relaxed">
                          {movie.overview}
                        </p>

                        <div className="pt-1 flex items-center gap-1.5 text-xs text-[#E1121D] font-semibold">
                          <Users className="w-3.5 h-3.5 text-[#E1121D]" />
                          <span>Matched by {matchedMemberNames.join(', ')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Streaming Providers */}
                    <StreamingProviders
                      movieId={movie.id}
                      initialRegion={room.settings.region || 'US'}
                      className="bg-[#F9F9F7] border-gray-200/60"
                    />
                  </div>

                  {/* Card Footer Actions */}
                  <div className="bg-[#E5E5EA]/50 px-5 py-3 border-t border-gray-200/60 flex items-center justify-between">
                    <span className="text-[11px] text-[#6E6E73] font-medium">
                      Matched {new Date(match.matchedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>

                    <button
                      onClick={() => setSelectedMovie(movie)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#0071E3] hover:text-[#0058A3] transition-colors"
                    >
                      <Info className="w-3.5 h-3.5" />
                      <span>Full Details</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedMovie && (
        <MovieDetailModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          region={room.settings.region || 'US'}
        />
      )}
    </div>
  );
};

import React from 'react';
import { Movie } from '../types';
import { StreamingProviders } from './StreamingProviders';
import { X, Star, Calendar, Clock, Film } from 'lucide-react';

interface MovieDetailModalProps {
  movie: Movie | null;
  onClose: () => void;
  region?: string;
}

export const MovieDetailModal: React.FC<MovieDetailModalProps> = ({
  movie,
  onClose,
  region = 'US'
}) => {
  if (!movie) return null;

  const year = movie.release_date ? movie.release_date.substring(0, 4) : 'N/A';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-[#F0F0EF] border border-gray-200/80 rounded-3xl apple-shadow-lg overflow-hidden my-8 max-h-[90vh] flex flex-col text-[#1D1D1F]"
        onClick={(e) => e.stopPropagation()}
        id="movie-detail-modal"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-[#F0F0EF]/80 hover:bg-[#F0F0EF] text-gray-700 backdrop-blur-md transition-colors apple-shadow-sm border border-gray-200/60"
          id="close-modal-btn"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Backdrop Banner */}
        <div className="relative h-48 sm:h-64 w-full bg-gray-100 overflow-hidden flex-shrink-0">
          {movie.backdrop_path || movie.poster_path ? (
            <img
              src={movie.backdrop_path || movie.poster_path || ''}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-[#F9F9F7] flex items-center justify-center">
              <Film className="w-16 h-16 text-gray-300" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          
          <div className="absolute bottom-4 left-4 right-4 flex items-end gap-4 text-white">
            {movie.poster_path && (
              <img
                src={movie.poster_path}
                alt={movie.title}
                className="w-20 h-28 sm:w-24 sm:h-36 rounded-xl shadow-md object-cover border border-white/40 flex-shrink-0"
              />
            )}
            <div className="text-white space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight">
                {movie.title}
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-200 font-medium">
                <div className="flex items-center gap-1 text-black font-bold bg-amber-400 px-2 py-0.5 rounded-md shadow-xs">
                  <Star className="w-3.5 h-3.5 fill-black" />
                  <span>{movie.vote_average.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-200">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{year}</span>
                </div>
                {movie.runtime && (
                  <div className="flex items-center gap-1 text-gray-200">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{movie.runtime} min</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto custom-scrollbar flex-1 bg-[#F0F0EF]">
          {/* Genres */}
          {movie.genres && movie.genres.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {movie.genres.map((g, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-[#E1121D] border border-red-100"
                >
                  {g}
                </span>
              ))}
            </div>
          )}

          {/* Overview */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#6E6E73]">
              Synopsis
            </h3>
            <p className="text-sm text-[#1D1D1F] leading-relaxed font-normal">
              {movie.overview || 'No synopsis provided.'}
            </p>
          </div>

          {/* Cast */}
          {movie.cast && movie.cast.length > 0 && (
            <div className="space-y-1.5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#6E6E73]">
                Key Cast
              </h3>
              <div className="flex flex-wrap gap-2 text-xs">
                {movie.cast.map((actor, idx) => (
                  <span
                    key={idx}
                    className="bg-[#F9F9F7] text-[#1D1D1F] px-3 py-1 rounded-xl border border-gray-200/60 font-medium"
                  >
                    {actor}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Streaming Availability */}
          <StreamingProviders movieId={movie.id} initialRegion={region} className="bg-[#F9F9F7]" />
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'motion/react';
import { Movie } from '../types';
import { Heart, X, Info, Star, Calendar, Clock } from 'lucide-react';

interface SwipeCardProps {
  movie: Movie;
  onSwipe: (vote: 'like' | 'pass') => void;
  onOpenDetails: (movie: Movie) => void;
  isFront: boolean;
}

export const SwipeCard: React.FC<SwipeCardProps> = ({
  movie,
  onSwipe,
  onOpenDetails,
  isFront
}) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0.5, 1, 1, 1, 0.5]);

  // Indicator badges transform
  const likeOpacity = useTransform(x, [20, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-20, -100], [0, 1]);

  const year = movie.release_date ? movie.release_date.substring(0, 4) : 'N/A';

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x > 100) {
      onSwipe('like');
    } else if (info.offset.x < -100) {
      onSwipe('pass');
    }
  };

  if (!isFront) {
    return (
      <div className="absolute inset-0 w-full h-full rounded-[24px] bg-[#F0F0EF] border border-gray-200/80 apple-shadow overflow-hidden pointer-events-none transform scale-95 translate-y-3 opacity-60 transition-all">
        {movie.poster_path ? (
          <img src={movie.poster_path} alt={movie.title} className="w-full h-full object-cover filter brightness-90" />
        ) : (
          <div className="w-full h-full bg-[#F5F5F7] flex items-center justify-center text-gray-500 font-bold">
            {movie.title}
          </div>
        )}
      </div>
    );
  }

  return (
    <motion.div
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      className="absolute inset-0 w-full h-full rounded-[24px] bg-[#F0F0EF] border border-gray-200/80 apple-shadow-lg overflow-hidden cursor-grab active:cursor-grabbing touch-none select-none flex flex-col justify-between"
      id={`swipe-card-${movie.id}`}
    >
      {/* Background Poster Image */}
      <div className="relative w-full h-full">
        {movie.poster_path ? (
          <img
            src={movie.poster_path}
            alt={movie.title}
            className="w-full h-full object-cover pointer-events-none"
            draggable={false}
          />
        ) : (
          <div className="w-full h-full bg-[#F5F5F7] flex flex-col items-center justify-center p-6 text-center">
            <h3 className="text-2xl font-bold text-[#1D1D1F]">{movie.title}</h3>
          </div>
        )}

        {/* Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

        {/* Swipe Badges Overlay */}
        <motion.div
          style={{ opacity: likeOpacity }}
          className="absolute top-8 left-8 z-20 border-2 border-[#34C759] text-[#34C759] bg-white/90 backdrop-blur-md font-extrabold text-xl uppercase px-5 py-2 rounded-2xl rotate-[-12deg] shadow-md tracking-wider"
        >
          LIKE
        </motion.div>

        <motion.div
          style={{ opacity: nopeOpacity }}
          className="absolute top-8 right-8 z-20 border-2 border-[#FF3B30] text-[#FF3B30] bg-white/90 backdrop-blur-md font-extrabold text-xl uppercase px-5 py-2 rounded-2xl rotate-[12deg] shadow-md tracking-wider"
        >
          PASS
        </motion.div>

        {/* Top Floating Actions (Info button) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetails(movie);
          }}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/30 hover:bg-black/50 text-white border border-white/20 backdrop-blur-md shadow-sm transition-all active:scale-95"
          title="Movie Info"
          id={`info-btn-${movie.id}`}
        >
          <Info className="w-5 h-5" />
        </button>

        {/* Bottom Metadata Panel */}
        <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 space-y-2 pointer-events-auto text-white">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="flex items-center gap-1 bg-amber-400 text-black px-2 py-0.5 rounded-md font-bold shadow-xs">
              <Star className="w-3.5 h-3.5 fill-black" />
              <span>{movie.vote_average.toFixed(1)}</span>
            </span>
            <span className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-md backdrop-blur-md border border-white/20">
              <Calendar className="w-3.5 h-3.5" />
              <span>{year}</span>
            </span>
            {movie.runtime && (
              <span className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-md backdrop-blur-md border border-white/20">
                <Clock className="w-3.5 h-3.5" />
                <span>{movie.runtime}m</span>
              </span>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
            {movie.title}
          </h2>

          <p className="text-xs sm:text-sm text-gray-200 line-clamp-2 leading-relaxed font-normal">
            {movie.overview}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

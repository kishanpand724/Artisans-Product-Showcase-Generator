import React from 'react';
import { Camera, RotateCcw, Sparkles } from 'lucide-react';

interface HeaderProps {
  imageCount: number;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ imageCount, onReset }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FBF9F6]/90 backdrop-blur-md border-b border-black/5 transition-all">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 h-20 flex items-center justify-between">
        
        {/* Artistic Flair Brand Logo */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-2xl font-serif italic tracking-tight font-light text-[#1A1A1A]">
              Artisan
            </span>
            <span className="text-[10px] uppercase tracking-[0.4em] font-semibold -mt-1 text-[#1A1A1A]">
              Showcase AI
            </span>
          </div>
          <span className="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-widest font-semibold bg-black/5 text-[#1A1A1A]/70 border border-black/5">
            Phase 1 Studio
          </span>
        </div>

        {/* Minimal Nav Links */}
        <div className="hidden lg:flex items-center gap-8 text-[11px] uppercase tracking-widest font-medium">
          <span className="border-b border-[#1A1A1A] pb-1 font-bold text-[#1A1A1A]">Studio</span>
          <span className="opacity-40 hover:opacity-100 transition-opacity cursor-pointer">Collections</span>
          <span className="opacity-40 hover:opacity-100 transition-opacity cursor-pointer">Pricing</span>
        </div>

        {/* Right Status & Action controls */}
        <div className="flex items-center gap-3">
          {imageCount > 0 && (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] uppercase tracking-wider font-semibold text-[#1A1A1A]/60 hover:text-[#1A1A1A] hover:bg-black/5 transition-all cursor-pointer"
              title="Clear uploaded images"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear ({imageCount})</span>
            </button>
          )}

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-black/10 shadow-xs text-[11px] uppercase tracking-wider font-semibold text-[#1A1A1A]">
            <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
            <span>{imageCount} / 3 Angles</span>
          </div>
        </div>
      </div>
    </header>
  );
};

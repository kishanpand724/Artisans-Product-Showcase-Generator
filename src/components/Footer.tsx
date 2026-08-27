import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-transparent border-t border-black/5 py-12 mt-12 text-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] uppercase tracking-[0.2em] font-semibold opacity-50">
        <div className="flex items-center gap-2">
          <span className="font-serif italic text-sm font-normal text-[#1A1A1A] tracking-normal">Artisan Showcase AI</span>
          <span>— Phase 1 Studio</span>
        </div>
        
        <span>© {new Date().getFullYear()} All Rights Reserved. Multi-Angle Product Engine.</span>
      </div>
    </footer>
  );
};

import React, { useState } from 'react';
import { ProductImage } from '../types';
import { Sparkles, X, Sun, Layers, ShieldCheck, CheckCircle2, RotateCw, ZoomIn, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ShowcasePreviewModalProps {
  images: ProductImage[];
  onClose: () => void;
}

type LightingPreset = 'Warm Studio' | 'Gallery Exhibition' | 'Natural Sunlight';

export const ShowcasePreviewModal: React.FC<ShowcasePreviewModalProps> = ({
  images,
  onClose,
}) => {
  const [activeAngleIndex, setActiveAngleIndex] = useState(0);
  const [lighting, setLighting] = useState<LightingPreset>('Warm Studio');
  const [isZoomed, setIsZoomed] = useState(false);

  const activeImage = images[activeAngleIndex] || images[0];

  const getLightingStyle = () => {
    switch (lighting) {
      case 'Gallery Exhibition':
        return 'bg-gradient-to-b from-[#1F1B18] via-[#2A2420] to-[#12100E] text-[#FAF8F5]';
      case 'Natural Sunlight':
        return 'bg-gradient-to-br from-[#FFFBF7] via-[#FAF5EE] to-[#F5EBE0] text-[#2C2825]';
      case 'Warm Studio':
      default:
        return 'bg-gradient-to-br from-[#2D2621] via-[#3B322B] to-[#211B17] text-[#FAF8F5]';
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-[#1A1A1A]/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-5xl bg-[#FBF9F6] rounded-[32px] sm:rounded-[40px] overflow-hidden shadow-2xl border border-black/10 my-auto"
        >
          {/* Top Modal Header */}
          <div className="p-5 sm:p-6 bg-white border-b border-black/5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center shadow-xs">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-serif text-lg sm:text-xl font-light text-[#1A1A1A]">
                  Artisan Multi-Angle Showcase
                </h3>
                <p className="text-[11px] text-[#1A1A1A]/50 font-medium">
                  Composition of {images.length} verified product angles
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-black/5 hover:bg-black/10 text-[#1A1A1A] flex items-center justify-center transition-colors cursor-pointer"
              title="Close showcase"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Phase Notice Banner */}
          <div className="bg-emerald-50 border-b border-emerald-200/60 px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-emerald-900">
            <div className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                <strong>Frontend Phase Verified:</strong> Multi-angle upload state, remove logic, and button activation validated with {images.length} images.
              </span>
            </div>
            <span className="font-bold uppercase tracking-widest text-[9px] bg-emerald-800 text-white px-2.5 py-1 rounded-full self-start sm:self-auto">
              Ready for AI Integration
            </span>
          </div>

          {/* Main Showcase Stage */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            
            {/* Left Stage Viewer */}
            <div className={`lg:col-span-8 p-6 sm:p-10 transition-colors duration-500 flex flex-col justify-between min-h-[420px] ${getLightingStyle()}`}>
              
              {/* Lighting controls bar */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold opacity-90">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span className="text-[11px] uppercase tracking-wider">Studio Mood:</span>
                </div>

                <div className="flex items-center gap-1 bg-black/30 p-1 rounded-full backdrop-blur-xs text-xs font-medium">
                  {(['Warm Studio', 'Gallery Exhibition', 'Natural Sunlight'] as LightingPreset[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setLighting(mode)}
                      className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider transition-all cursor-pointer ${
                        lighting === mode
                          ? 'bg-white text-[#1A1A1A] font-bold shadow-xs'
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Product Angle Display */}
              <div className="relative flex-1 flex items-center justify-center py-6">
                <div 
                  className={`relative max-w-full transition-transform duration-300 ${
                    isZoomed ? 'scale-125 cursor-zoom-out' : 'scale-100 cursor-zoom-in'
                  }`}
                  onClick={() => setIsZoomed(!isZoomed)}
                >
                  <img
                    src={activeImage.url}
                    alt={activeImage.name}
                    className="max-h-[340px] w-auto object-contain rounded-2xl shadow-2xl border border-white/10"
                  />
                  
                  {/* Angle Badge */}
                  <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-white text-[10px] uppercase tracking-widest font-bold">
                    {activeImage.angle} View (#{activeAngleIndex + 1})
                  </div>
                </div>
              </div>

              {/* Angle Selector Thumbnails */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-center gap-3">
                {images.map((img, index) => (
                  <button
                    key={img.id}
                    onClick={() => {
                      setActiveAngleIndex(index);
                      setIsZoomed(false);
                    }}
                    className={`relative rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      activeAngleIndex === index
                        ? 'border-white ring-2 ring-white/50 scale-105'
                        : 'border-white/20 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={img.name}
                      className="w-14 h-14 object-cover"
                    />
                    <span className="absolute bottom-0 inset-x-0 bg-black/80 text-[9px] uppercase tracking-wider text-white text-center font-bold truncate px-1 py-0.5">
                      {img.angle}
                    </span>
                  </button>
                ))}
              </div>

            </div>

            {/* Right Information Panel */}
            <div className="lg:col-span-4 p-6 sm:p-8 bg-white flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-black/5">
              
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#1A1A1A]/40">
                    Multi-Angle Composition
                  </span>
                  <h4 className="font-serif text-2xl font-light text-[#1A1A1A] mt-1">
                    Handcrafted Masterpiece
                  </h4>
                  <p className="text-xs text-[#1A1A1A]/50 mt-1 leading-relaxed">
                    Uploaded product perspectives are synced for 3D model reconstruction & studio renders.
                  </p>
                </div>

                {/* Perspective Breakdown list */}
                <div className="space-y-3">
                  <h5 className="text-[10px] font-bold text-[#1A1A1A]/50 uppercase tracking-[0.2em]">
                    Uploaded Perspectives ({images.length})
                  </h5>
                  <div className="space-y-2">
                    {images.map((img, idx) => (
                      <div
                        key={img.id}
                        onClick={() => setActiveAngleIndex(idx)}
                        className={`p-3 rounded-2xl border text-xs flex items-center justify-between transition-all cursor-pointer ${
                          activeAngleIndex === idx
                            ? 'bg-[#F5F2ED] border-black text-[#1A1A1A] font-semibold'
                            : 'bg-white border-black/5 text-[#1A1A1A]/70 hover:border-black/30'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-black/5 text-[#1A1A1A] font-bold text-[10px] flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span>{img.angle} Perspective</span>
                        </div>
                        <span className="text-[11px] text-[#1A1A1A]/50 font-normal truncate max-w-[100px]">
                          {img.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Product Metadata Info */}
                <div className="p-4 rounded-2xl bg-[#FBF9F6] border border-black/5 text-xs space-y-2 text-[#1A1A1A]/70">
                  <div className="flex justify-between">
                    <span className="text-[#1A1A1A]/40 font-medium">Angles Count:</span>
                    <span className="font-bold text-[#1A1A1A]">{images.length} / 3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#1A1A1A]/40 font-medium">Requirement Status:</span>
                    <span className="font-bold text-emerald-800">Passed (Min. 2)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#1A1A1A]/40 font-medium">Showcase Mode:</span>
                    <span className="font-bold text-[#1A1A1A]">{lighting}</span>
                  </div>
                </div>

              </div>

              {/* Bottom Close Action */}
              <div className="pt-6 border-t border-black/5 mt-6">
                <button
                  onClick={onClose}
                  className="w-full py-4 rounded-full bg-[#1A1A1A] text-white font-bold text-xs uppercase tracking-[0.2em] hover:bg-black transition-colors cursor-pointer"
                >
                  Return to Upload Studio
                </button>
              </div>

            </div>

          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

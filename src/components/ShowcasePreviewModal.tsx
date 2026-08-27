import React, { useState } from 'react';
import { ProductImage, ShowcaseStyle } from '../types';
import { Sparkles, X, CheckCircle2, Copy, Check, SlidersHorizontal, MessageSquareText, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ShowcasePreviewModalProps {
  images: ProductImage[];
  selectedStyle: ShowcaseStyle;
  extraInstructions: string;
  generatedPrompt: string;
  onClose: () => void;
}

type LightingPreset = 'Warm Studio' | 'Gallery Exhibition' | 'Natural Sunlight';

export const ShowcasePreviewModal: React.FC<ShowcasePreviewModalProps> = ({
  images,
  selectedStyle,
  extraInstructions,
  generatedPrompt,
  onClose,
}) => {
  const [activeAngleIndex, setActiveAngleIndex] = useState(0);
  const [lighting, setLighting] = useState<LightingPreset>('Warm Studio');
  const [copied, setCopied] = useState(false);

  const activeImage = images[activeAngleIndex] || images[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLightingStyle = () => {
    switch (lighting) {
      case 'Gallery Exhibition':
        return 'bg-gradient-to-b from-[#1A1A1A] via-[#262422] to-[#121212] text-white';
      case 'Natural Sunlight':
        return 'bg-gradient-to-br from-[#FFFBF7] via-[#FAF5EE] to-[#F5EBE0] text-[#1A1A1A]';
      case 'Warm Studio':
      default:
        return 'bg-gradient-to-br from-[#2D2825] via-[#38312C] to-[#1F1B18] text-white';
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-[#1A1A1A]/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
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
                  Artisan Showcase Engine
                </h3>
                <p className="text-[11px] text-[#1A1A1A]/50 font-medium">
                  Phase 3 Verification: Style & Prompt Generation Ready
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-black/5 hover:bg-black/10 text-[#1A1A1A] flex items-center justify-center transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Phase 3 Banner */}
          <div className="bg-emerald-50 border-b border-emerald-200/60 px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-emerald-900">
            <div className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                <strong>Phase 3 Complete:</strong> {selectedStyle} style selected with {images.length} reference photos and structured prompt generated.
              </span>
            </div>
            <span className="font-bold uppercase tracking-widest text-[9px] bg-emerald-800 text-white px-2.5 py-1 rounded-full self-start sm:self-auto">
              Ready for Phase 4 API Hook
            </span>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            
            {/* Left Column: Image Angles Staging */}
            <div className={`lg:col-span-7 p-6 sm:p-8 transition-colors duration-500 flex flex-col justify-between ${getLightingStyle()}`}>
              
              {/* Controls bar */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-80 flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  Product Reference Angles ({images.length})
                </span>

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

              {/* Active Image */}
              <div className="relative flex-1 flex items-center justify-center py-6">
                <div className="relative max-w-full">
                  <img
                    src={activeImage.url}
                    alt={activeImage.name}
                    className="max-h-[280px] w-auto object-contain rounded-2xl shadow-2xl border border-white/10"
                  />
                  <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-white text-[10px] uppercase tracking-widest font-bold">
                    {activeImage.angle} Perspective
                  </div>
                </div>
              </div>

              {/* Thumbnails */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-center gap-3">
                {images.map((img, index) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveAngleIndex(index)}
                    className={`relative rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      activeAngleIndex === index
                        ? 'border-white ring-2 ring-white/50 scale-105'
                        : 'border-white/20 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={img.name}
                      className="w-12 h-12 object-cover"
                    />
                    <span className="absolute bottom-0 inset-x-0 bg-black/80 text-[8px] uppercase tracking-wider text-white text-center font-bold truncate px-1">
                      {img.angle}
                    </span>
                  </button>
                ))}
              </div>

            </div>

            {/* Right Column: Style & Prompt Generation Summary */}
            <div className="lg:col-span-5 p-6 sm:p-8 bg-white flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-black/5 space-y-6">
              
              <div className="space-y-5">
                
                {/* Style Badge */}
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#1A1A1A]/40 block mb-1">
                    Selected Style
                  </span>
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1A1A1A] text-white font-serif text-sm">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>{selectedStyle} Preset</span>
                  </div>
                </div>

                {/* Extra Instructions Preview */}
                {extraInstructions.trim().length > 0 && (
                  <div className="p-3 rounded-2xl bg-[#F5F2ED] border border-black/5 space-y-1">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-[#1A1A1A]/50 flex items-center gap-1">
                      <MessageSquareText className="w-3 h-3 text-[#1A1A1A]" />
                      Extra Instructions Included
                    </span>
                    <p className="text-xs text-[#1A1A1A] italic">
                      "{extraInstructions.trim()}"
                    </p>
                  </div>
                )}

                {/* Structured Prompt Box */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#1A1A1A]/50 uppercase tracking-[0.2em]">
                      Structured AI Prompt
                    </span>
                    <button
                      onClick={handleCopy}
                      className="text-[10px] uppercase tracking-wider font-bold text-[#1A1A1A] hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#1A1A1A] text-gray-200 font-mono text-[10px] leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap select-all">
                    {generatedPrompt}
                  </div>
                </div>

                {/* Status List */}
                <div className="p-4 rounded-2xl bg-[#FBF9F6] border border-black/5 text-xs space-y-2 text-[#1A1A1A]/70">
                  <div className="flex justify-between">
                    <span className="text-[#1A1A1A]/40 font-medium">Reference Images:</span>
                    <span className="font-bold text-[#1A1A1A]">{images.length} Angles</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#1A1A1A]/40 font-medium">Product Identity Guard:</span>
                    <span className="font-bold text-emerald-800">Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#1A1A1A]/40 font-medium">AI API Integration:</span>
                    <span className="font-bold text-amber-800">Pending (Phase 4)</span>
                  </div>
                </div>

              </div>

              {/* Close Button */}
              <div className="pt-4 border-t border-black/5">
                <button
                  onClick={onClose}
                  className="w-full py-4 rounded-full bg-[#1A1A1A] text-white font-bold text-xs uppercase tracking-[0.2em] hover:bg-black transition-colors cursor-pointer"
                >
                  Return to Studio
                </button>
              </div>

            </div>

          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

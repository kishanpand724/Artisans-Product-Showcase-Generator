import React from 'react';
import { Sparkles, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface GenerateActionProps {
  imageCount: number;
  onGenerateShowcase: () => void;
}

export const GenerateAction: React.FC<GenerateActionProps> = ({
  imageCount,
  onGenerateShowcase,
}) => {
  const isEnabled = imageCount >= 2;

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 mb-16">
      <div className={`rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 border transition-all duration-300 ${
        isEnabled
          ? 'bg-white/90 backdrop-blur-md border-black/10 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.06)]'
          : 'bg-white/40 backdrop-blur-sm border-black/5'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          {/* Status info */}
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-3">
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#1A1A1A]/40">
                Step 02: Verification & Generation
              </span>
            </div>
            
            <h3 className="font-serif text-2xl font-light text-[#1A1A1A]">
              {isEnabled ? 'Multi-Angle Perspective Ready' : 'Upload Minimum 2 Perspectives'}
            </h3>
            
            <p className="text-xs sm:text-sm text-[#1A1A1A]/60 leading-relaxed font-normal">
              {isEnabled ? (
                <span>
                  <strong className="text-[#1A1A1A] font-semibold">{imageCount} product views verified.</strong> You have fulfilled the multi-angle showcase criteria.
                </span>
              ) : (
                <span>
                  Upload at least <strong className="text-[#1A1A1A] font-semibold">2 perspectives</strong> (currently {imageCount}/2) to enable the showcase generator.
                </span>
              )}
            </p>
          </div>

          {/* Full-width / Spacious Action Button matching Artistic Flair styling */}
          <div className="flex flex-col items-center md:items-end gap-3 shrink-0">
            <motion.button
              whileHover={isEnabled ? { scale: 1.01 } : {}}
              whileTap={isEnabled ? { scale: 0.98 } : {}}
              disabled={!isEnabled}
              onClick={onGenerateShowcase}
              className={`w-full md:w-auto px-10 py-5 rounded-full text-[11px] uppercase tracking-[0.25em] font-bold transition-all duration-300 flex items-center justify-center gap-3 ${
                isEnabled
                  ? 'bg-[#1A1A1A] text-white hover:bg-black shadow-lg shadow-black/10 cursor-pointer'
                  : 'bg-[#EFECE6] text-gray-400 cursor-not-allowed border border-black/5'
              }`}
            >
              {isEnabled ? (
                <>
                  <Sparkles className="w-4 h-4 text-white animate-pulse" />
                  <span>Continue to Showcase</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-gray-400" />
                  <span>Continue</span>
                  <span className="text-[9px] bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-bold">
                    {imageCount}/2 Min
                  </span>
                </>
              )}
            </motion.button>

            {/* Sub-label explaining state */}
            {!isEnabled && (
              <p className="text-[10px] uppercase tracking-wider text-[#1A1A1A]/40 font-semibold">
                Requires 2 or 3 product images
              </p>
            )}
            {isEnabled && (
              <p className="text-[10px] uppercase tracking-wider text-emerald-800 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Ready to compose multi-angle showcase
              </p>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

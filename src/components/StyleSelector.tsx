import React, { useState } from 'react';
import { ProductImage, ShowcaseStyle } from '../types';
import { STYLE_OPTIONS, generateStructuredPrompt } from '../utils/promptGenerator';
import { 
  Sparkles, 
  Copy, 
  Check, 
  SlidersHorizontal, 
  MessageSquareText, 
  ArrowRight,
  ShieldCheck,
  Feather,
  Crown,
  Compass,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';

interface StyleSelectorProps {
  images: ProductImage[];
  selectedStyle: ShowcaseStyle;
  onSelectStyle: (style: ShowcaseStyle) => void;
  extraInstructions: string;
  onChangeExtraInstructions: (text: string) => void;
  onGenerateShowcase: () => void;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({
  images,
  selectedStyle,
  onSelectStyle,
  extraInstructions,
  onChangeExtraInstructions,
  onGenerateShowcase,
}) => {
  const [copied, setCopied] = useState(false);

  // Generate the live structured prompt
  const generatedPrompt = generateStructuredPrompt(selectedStyle, extraInstructions, images);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStyleIcon = (styleId: ShowcaseStyle) => {
    switch (styleId) {
      case 'Minimal':
        return <Feather className="w-5 h-5 text-[#1A1A1A]" />;
      case 'Premium':
        return <Crown className="w-5 h-5 text-amber-300" />;
      case 'Traditional':
        return <Compass className="w-5 h-5 text-[#8C6D53]" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <section id="style-selection" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 mb-16 scroll-mt-24">
      <div className="bg-white/90 backdrop-blur-md rounded-[32px] sm:rounded-[40px] border border-black/10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.06)] p-6 sm:p-10 flex flex-col gap-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-end border-b border-black/5 pb-6 gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#1A1A1A]/40 block mb-1">
              Phase 3: Style & Prompt Staging
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-light text-[#1A1A1A]">
              Choose Showcase Style
            </h2>
            <p className="text-xs sm:text-[13px] text-[#1A1A1A]/50 mt-1 max-w-xl">
              Select a visual direction for your product showcase and fine-tune optional instructions.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/5 text-[10px] uppercase tracking-wider font-bold text-[#1A1A1A]/70 border border-black/5 self-start sm:self-auto">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#1A1A1A]" />
            <span>1 Style Selected</span>
          </div>
        </div>

        {/* 3 Style Cards Selection Grid */}
        <div>
          <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#1A1A1A]/60 block mb-4">
            Select 1 Aesthetics Preset
          </label>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {STYLE_OPTIONS.map((style) => {
              const isSelected = selectedStyle === style.id;

              return (
                <motion.div
                  key={style.id}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelectStyle(style.id)}
                  className={`relative p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between h-full ${
                    isSelected
                      ? 'bg-white border-black shadow-lg ring-1 ring-black'
                      : 'bg-[#F9F7F3] border-black/5 hover:border-black/20 hover:bg-[#F5F2ED]'
                  }`}
                >
                  {/* Top card header */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${style.colorBadge}`}>
                        {getStyleIcon(style.id)}
                      </div>

                      {/* Radio Selection Indicator */}
                      <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                        isSelected ? 'bg-black border-black text-white' : 'border-black/20 bg-white'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                    </div>

                    <h3 className="font-serif text-xl font-normal text-[#1A1A1A] mb-1">
                      {style.title}
                    </h3>

                    <span className="text-[10px] uppercase tracking-wider font-semibold text-[#1A1A1A]/60 block mb-3">
                      {style.tagline}
                    </span>

                    <p className="text-xs text-[#1A1A1A]/70 leading-relaxed font-normal mb-4">
                      {style.description}
                    </p>
                  </div>

                  {/* Style Details pills */}
                  <div className="pt-4 border-t border-black/5 space-y-2 text-[11px] text-[#1A1A1A]/80">
                    <div className="flex items-start gap-1.5">
                      <span className="font-bold text-[#1A1A1A] shrink-0">• Background:</span>
                      <span className="truncate">{style.background}</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span className="font-bold text-[#1A1A1A] shrink-0">• Lighting:</span>
                      <span className="truncate">{style.lighting}</span>
                    </div>
                  </div>

                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Extra Instructions Optional Text Input */}
        <div className="p-6 rounded-3xl bg-[#F5F2ED] border border-black/5 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] flex items-center gap-2">
              <MessageSquareText className="w-4 h-4 text-[#1A1A1A]" />
              Extra Instructions <span className="text-[10px] text-[#1A1A1A]/40 font-normal">(Optional)</span>
            </label>
            <span className="text-[10px] text-[#1A1A1A]/40 uppercase tracking-wider font-semibold">
              Fine-tune prompt
            </span>
          </div>

          <textarea
            value={extraInstructions}
            onChange={(e) => onChangeExtraInstructions(e.target.value)}
            placeholder="e.g., Place item on a polished marble block with soft botanical shadows and warm ambient highlights..."
            rows={2}
            className="w-full bg-white border border-black/10 rounded-2xl p-4 text-xs text-[#1A1A1A] placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-black transition-all resize-none font-normal"
          />
          <p className="text-[11px] text-[#1A1A1A]/50">
            Specify props, background nuances, or staging preferences without changing the product itself.
          </p>
        </div>

        {/* Live Structured Generated Prompt Preview */}
        <div className="p-6 rounded-3xl bg-[#1A1A1A] text-white space-y-4 shadow-md">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest text-white">
                Generated AI Prompt Preview
              </span>
            </div>

            <button
              onClick={handleCopyPrompt}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-[10px] uppercase tracking-wider font-bold text-white transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-white/80" />
                  <span>Copy Prompt</span>
                </>
              )}
            </button>
          </div>

          {/* Formatted Prompt Textbox */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 font-mono text-[11px] leading-relaxed text-gray-300 max-h-48 overflow-y-auto whitespace-pre-wrap select-all">
            {generatedPrompt}
          </div>

          <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-white/40 pt-1 font-semibold">
            <span>Product Fidelity Guard Enforced</span>
            <span>{selectedStyle} Style Active</span>
          </div>
        </div>

        {/* Action Button: Generate Showcase */}
        <div className="pt-4 border-t border-black/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-[#1A1A1A]/70">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Ready for Generation • {images.length} Product Photos Attached</span>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={onGenerateShowcase}
            className="w-full sm:w-auto px-10 py-5 rounded-full bg-[#1A1A1A] text-white hover:bg-black font-bold text-[11px] uppercase tracking-[0.25em] shadow-lg shadow-black/10 transition-all flex items-center justify-center gap-3 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Generate Showcase</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>

      </div>
    </section>
  );
};

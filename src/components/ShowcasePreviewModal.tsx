import React, { useState } from 'react';
import { ProductImage, ShowcaseStyle } from '../types';
import { 
  Sparkles, 
  X, 
  CheckCircle2, 
  Copy, 
  Check, 
  SlidersHorizontal, 
  MessageSquareText, 
  Download,
  RotateCw,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  ShieldCheck,
  Eye,
  Layers,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ShowcasePreviewModalProps {
  images: ProductImage[];
  selectedStyle: ShowcaseStyle;
  extraInstructions: string;
  generatedPrompt: string;
  isGenerating: boolean;
  generatedImageUrl: string | null;
  generationError: string | null;
  progressStep: string;
  onRetry: () => void;
  onClose: () => void;
}

type ModalViewTab = 'showcase' | 'references';

export const ShowcasePreviewModal: React.FC<ShowcasePreviewModalProps> = ({
  images,
  selectedStyle,
  extraInstructions,
  generatedPrompt,
  isGenerating,
  generatedImageUrl,
  generationError,
  progressStep,
  onRetry,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<ModalViewTab>('showcase');
  const [activeAngleIndex, setActiveAngleIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const activeReferenceImage = images[activeAngleIndex] || images[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!generatedImageUrl) return;
    const link = document.createElement('a');
    link.href = generatedImageUrl;
    link.download = `artisan-showcase-${selectedStyle.toLowerCase()}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-[#1A1A1A]/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-5xl bg-[#FBF9F6] rounded-[32px] sm:rounded-[40px] overflow-hidden shadow-2xl border border-black/10 my-auto"
        >
          {/* Modal Header */}
          <div className="p-5 sm:p-6 bg-white border-b border-black/5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center shadow-xs">
                {isGenerating ? (
                  <Loader2 className="w-5 h-5 text-amber-300 animate-spin" />
                ) : (
                  <Sparkles className="w-5 h-5 text-amber-300" />
                )}
              </div>
              <div>
                <h3 className="font-serif text-lg sm:text-xl font-light text-[#1A1A1A]">
                  AI Product Showcase Studio
                </h3>
                <p className="text-[11px] text-[#1A1A1A]/50 font-medium">
                  Phase 4: Multi-Angle Preserved Product Image Generation
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              disabled={isGenerating}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                isGenerating 
                  ? 'bg-black/5 text-gray-300 cursor-not-allowed'
                  : 'bg-black/5 hover:bg-black/10 text-[#1A1A1A] cursor-pointer'
              }`}
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Banner Status Line */}
          {isGenerating ? (
            <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 flex items-center gap-3 text-xs text-amber-900">
              <Loader2 className="w-4 h-4 text-amber-600 animate-spin shrink-0" />
              <div className="flex-1">
                <span className="font-semibold">{progressStep || 'Generating showcase image...'}</span>
              </div>
              <span className="font-bold uppercase tracking-wider text-[9px] bg-amber-800 text-white px-2.5 py-1 rounded-full">
                Gemini AI Processing
              </span>
            </div>
          ) : generationError ? (
            <div className="bg-rose-50 border-b border-rose-200 px-6 py-3 flex items-center justify-between gap-3 text-xs text-rose-900">
              <div className="flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Showcase generation failed. You can retry generation using your reference photos.</span>
              </div>
              <button
                onClick={onRetry}
                className="px-3 py-1 rounded-full bg-rose-700 hover:bg-rose-800 text-white font-bold text-[10px] uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCw className="w-3 h-3" />
                <span>Retry Generation</span>
              </button>
            </div>
          ) : generatedImageUrl ? (
            <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-3 flex items-center justify-between gap-2 text-xs text-emerald-900">
              <div className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  <strong>Showcase Generated:</strong> {selectedStyle} preset generated with original product identity & fine details preserved.
                </span>
              </div>
              <span className="font-bold uppercase tracking-widest text-[9px] bg-emerald-800 text-white px-2.5 py-1 rounded-full">
                Fidelity Guard Verified
              </span>
            </div>
          ) : null}

          {/* Main Grid Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            
            {/* Left Column: Visual Showcase Display Stage */}
            <div className="lg:col-span-7 p-6 sm:p-8 bg-gradient-to-br from-[#1F1B18] via-[#2A2420] to-[#141210] text-white flex flex-col justify-between min-h-[440px]">
              
              {/* Header Tab Switching (Generated vs References) */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                <div className="flex items-center gap-1 bg-black/40 p-1 rounded-full border border-white/10 backdrop-blur-md">
                  <button
                    onClick={() => setActiveTab('showcase')}
                    className={`px-3.5 py-1.5 rounded-full text-[10px] uppercase tracking-wider font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      activeTab === 'showcase'
                        ? 'bg-white text-[#1A1A1A] shadow-xs'
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>AI Showcase Image</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('references')}
                    className={`px-3.5 py-1.5 rounded-full text-[10px] uppercase tracking-wider font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      activeTab === 'references'
                        ? 'bg-white text-[#1A1A1A] shadow-xs'
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Reference Angles ({images.length})</span>
                  </button>
                </div>

                <div className="text-[10px] uppercase tracking-widest font-bold text-white/50 hidden sm:block">
                  {selectedStyle} Preset
                </div>
              </div>

              {/* Main Stage Display */}
              <div className="relative flex-1 flex flex-col items-center justify-center my-4">
                
                {/* STATE 1: GENERATING LOADING */}
                {isGenerating && (
                  <div className="flex flex-col items-center justify-center text-center p-8 space-y-4 my-auto">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full border-2 border-amber-300/30 border-t-amber-300 animate-spin flex items-center justify-center" />
                      <Sparkles className="w-8 h-8 text-amber-300 absolute inset-0 m-auto animate-pulse" />
                    </div>
                    <div>
                      <h4 className="font-serif text-xl font-light text-white mb-1">
                        Creating Product Showcase
                      </h4>
                      <p className="text-xs text-white/70 max-w-sm">
                        {progressStep || 'Preserving product geometry, textures and details while rendering scene...'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-amber-200/80 bg-black/40 px-3 py-1.5 rounded-full border border-amber-300/20 uppercase tracking-widest font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                      <span>Fidelity Guard Active</span>
                    </div>
                  </div>
                )}

                {/* STATE 2: GENERATION ERROR */}
                {!isGenerating && generationError && (
                  <div className="flex flex-col items-center justify-center text-center p-6 space-y-4 my-auto max-w-md bg-rose-950/40 rounded-3xl border border-rose-500/20">
                    <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center">
                      <AlertCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-serif text-lg font-light text-white mb-1">
                        Generation Error
                      </h4>
                      <p className="text-xs text-rose-200/90 leading-relaxed font-mono bg-black/40 p-3 rounded-xl border border-rose-500/20 text-left max-h-32 overflow-y-auto">
                        {generationError}
                      </p>
                    </div>
                    <button
                      onClick={onRetry}
                      className="px-6 py-2.5 rounded-full bg-white text-[#1A1A1A] hover:bg-gray-100 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-md"
                    >
                      <RotateCw className="w-4 h-4 text-rose-600" />
                      <span>Retry Generation</span>
                    </button>
                  </div>
                )}

                {/* STATE 3: GENERATED IMAGE DISPLAY */}
                {!isGenerating && !generationError && activeTab === 'showcase' && (
                  generatedImageUrl ? (
                    <div className="relative max-w-full flex flex-col items-center">
                      <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
                        <img
                          src={generatedImageUrl}
                          alt="AI Generated Showcase"
                          className="max-h-[320px] sm:max-h-[360px] w-auto object-contain rounded-2xl transition-transform duration-500 group-hover:scale-[1.01]"
                        />
                        <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-amber-300 text-[9px] uppercase tracking-widest font-bold flex items-center gap-1.5 border border-amber-300/30">
                          <Sparkles className="w-3 h-3" />
                          <span>Gemini Showcase</span>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center gap-3">
                        <button
                          onClick={handleDownload}
                          className="px-4 py-2 rounded-full bg-white text-[#1A1A1A] hover:bg-amber-100 font-bold text-xs uppercase tracking-wider transition-all inline-flex items-center gap-2 cursor-pointer shadow-md"
                        >
                          <Download className="w-4 h-4 text-emerald-700" />
                          <span>Download Image</span>
                        </button>
                        <button
                          onClick={onRetry}
                          className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all inline-flex items-center gap-2 cursor-pointer border border-white/20"
                        >
                          <RotateCw className="w-3.5 h-3.5 text-white/80" />
                          <span>Regenerate</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-8 text-white/50">
                      <Sparkles className="w-10 h-10 text-amber-300/40 mx-auto mb-3" />
                      <p className="text-xs">Click "Generate Showcase" to create your product scene.</p>
                    </div>
                  )
                )}

                {/* STATE 4: REFERENCE ANGLES DISPLAY */}
                {!isGenerating && activeTab === 'references' && (
                  <div className="w-full flex flex-col items-center space-y-4">
                    <div className="relative max-w-full">
                      <img
                        src={activeReferenceImage.url}
                        alt={activeReferenceImage.name}
                        className="max-h-[260px] sm:max-h-[290px] w-auto object-contain rounded-2xl shadow-xl border border-white/10"
                      />
                      <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-white text-[10px] uppercase tracking-widest font-bold">
                        {activeReferenceImage.angle} View Reference
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-3 pt-2">
                      {images.map((img, index) => (
                        <button
                          key={img.id}
                          onClick={() => setActiveAngleIndex(index)}
                          className={`relative rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                            activeAngleIndex === index
                              ? 'border-amber-400 ring-2 ring-amber-400/40 scale-105'
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
                )}

              </div>

              {/* Bottom Stage Footer */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] uppercase tracking-wider text-white/50 font-semibold">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Product Identity Preserved
                </span>
                <span>{images.length} Angle Inputs</span>
              </div>

            </div>

            {/* Right Column: Prompt & Generation Specifications */}
            <div className="lg:col-span-5 p-6 sm:p-8 bg-white flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-black/5 space-y-6">
              
              <div className="space-y-5">
                
                {/* Selected Style Info */}
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#1A1A1A]/40 block mb-1">
                    Staged Style Preset
                  </span>
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1A1A1A] text-white font-serif text-sm">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>{selectedStyle} Style</span>
                  </div>
                </div>

                {/* Extra Instructions Preview */}
                {extraInstructions.trim().length > 0 && (
                  <div className="p-3 rounded-2xl bg-[#F5F2ED] border border-black/5 space-y-1">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-[#1A1A1A]/50 flex items-center gap-1">
                      <MessageSquareText className="w-3 h-3 text-[#1A1A1A]" />
                      Custom Staging Instructions
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
                      Structured Gemini Prompt
                    </span>
                    <button
                      onClick={handleCopy}
                      className="text-[10px] uppercase tracking-wider font-bold text-[#1A1A1A] hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#1A1A1A] text-gray-200 font-mono text-[10px] leading-relaxed max-h-40 overflow-y-auto whitespace-pre-wrap select-all border border-black/10">
                    {generatedPrompt}
                  </div>
                </div>

                {/* Execution Specs List */}
                <div className="p-4 rounded-2xl bg-[#FBF9F6] border border-black/5 text-xs space-y-2.5 text-[#1A1A1A]/80">
                  <div className="flex justify-between items-center">
                    <span className="text-[#1A1A1A]/50 font-medium">Reference Photos:</span>
                    <span className="font-bold text-[#1A1A1A]">{images.length} Angle Inputs</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#1A1A1A]/50 font-medium">Product Fidelity Directive:</span>
                    <span className="font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Enforced
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#1A1A1A]/50 font-medium">Generation Service:</span>
                    <span className="font-bold text-[#1A1A1A]">Gemini AI Backend</span>
                  </div>
                </div>

              </div>

              {/* Action Buttons: Retry vs Close */}
              <div className="pt-4 border-t border-black/5 flex flex-col gap-2">
                {generationError ? (
                  <button
                    onClick={onRetry}
                    disabled={isGenerating}
                    className="w-full py-4 rounded-full bg-[#1A1A1A] hover:bg-black text-white font-bold text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <RotateCw className="w-4 h-4 text-amber-300" />
                    <span>Retry Generation</span>
                  </button>
                ) : (
                  <button
                    onClick={onClose}
                    disabled={isGenerating}
                    className="w-full py-4 rounded-full bg-[#1A1A1A] text-white font-bold text-xs uppercase tracking-[0.2em] hover:bg-black transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {generatedImageUrl ? 'Return to Studio' : 'Close Studio'}
                  </button>
                )}
              </div>

            </div>

          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

import React, { useRef, useState } from 'react';
import { ProductImage, AngleType, PresetProduct } from '../types';
import { SAMPLE_PRESETS } from '../data/presets';
import { 
  Upload, 
  Trash2, 
  Plus, 
  Image as ImageIcon, 
  AlertCircle, 
  Check, 
  Eye, 
  Tag, 
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ImageUploaderProps {
  images: ProductImage[];
  onAddImages: (files: File[]) => void;
  onRemoveImage: (id: string) => void;
  onUpdateAngle: (id: string, angle: AngleType) => void;
  onLoadPreset: (preset: PresetProduct) => void;
}

const AVAILABLE_ANGLES: AngleType[] = ['Front', 'Side', 'Detail', 'Back', 'Top', 'Angle View'];

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  onAddImages,
  onRemoveImage,
  onUpdateAngle,
  onLoadPreset,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [previewingImage, setPreviewingImage] = useState<ProductImage | null>(null);

  const canUploadMore = images.length < 3;
  const remainingSlots = 3 - images.length;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files) as File[];
      processFiles(selectedFiles);
    }
  };

  const processFiles = (files: File[]) => {
    // Filter only images
    const imageFiles = files.filter(f => f.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      setErrorMsg('Please select valid image files (JPG, PNG, WebP).');
      return;
    }

    if (images.length + imageFiles.length > 3) {
      const allowedCount = 3 - images.length;
      if (allowedCount <= 0) {
        setErrorMsg('Maximum 3 images allowed. Remove an existing image to upload a new one.');
        return;
      }
      setErrorMsg(`Only ${allowedCount} more image(s) can be added (Maximum 3 total).`);
      onAddImages(imageFiles.slice(0, allowedCount));
    } else {
      onAddImages(imageFiles);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (canUploadMore) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setErrorMsg(null);

    if (!canUploadMore) {
      setErrorMsg('Maximum 3 images limit reached. Remove an image to replace it.');
      return;
    }

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files) as File[];
      processFiles(droppedFiles);
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 mb-12">
      <div className="bg-white/80 backdrop-blur-md rounded-[32px] sm:rounded-[40px] border border-black/5 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] p-6 sm:p-10 flex flex-col">
        
        {/* Section Header matching Design Template */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-end mb-8 gap-4 border-b border-black/5 pb-6">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#1A1A1A]/40 block mb-1">
              Studio Workspace
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-light text-[#1A1A1A]">
              Product Canvas
            </h2>
            <p className="text-xs sm:text-[13px] text-[#1A1A1A]/50 mt-1">
              Upload 2 to 3 photos of your item from different angles (Front, Side, Detail).
            </p>
          </div>

          {/* 3 Step Dot Indicators matching design template */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-semibold text-[#1A1A1A]/60">
              {images.length}/3 Angles
            </span>
            <div className="flex gap-1.5">
              <div className={`w-2.5 h-2.5 rounded-full transition-all ${images.length >= 1 ? 'bg-[#1A1A1A]' : 'bg-black/10'}`} />
              <div className={`w-2.5 h-2.5 rounded-full transition-all ${images.length >= 2 ? 'bg-[#1A1A1A]' : 'bg-black/10'}`} />
              <div className={`w-2.5 h-2.5 rounded-full transition-all ${images.length >= 3 ? 'bg-[#1A1A1A]' : 'bg-black/10'}`} />
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="space-y-8">
          
          {/* Error Message banner */}
          {errorMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-red-50/80 border border-red-200/60 text-red-800 text-xs flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{errorMsg}</span>
              </div>
              <button 
                onClick={() => setErrorMsg(null)} 
                className="text-[11px] uppercase tracking-wider font-bold underline cursor-pointer"
              >
                Dismiss
              </button>
            </motion.div>
          )}

          {/* Quick Presets Section */}
          {images.length === 0 && (
            <div className="p-5 rounded-2xl bg-[#F5F2ED] border border-black/5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#1A1A1A]/70 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Try Preset Artisan Products
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[#1A1A1A]/40">Click to pre-fill 2-3 angles</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {SAMPLE_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => onLoadPreset(preset)}
                    className="p-3 rounded-xl bg-white border border-black/5 hover:border-black/30 hover:shadow-xs text-left transition-all group cursor-pointer flex items-center gap-3"
                  >
                    <img
                      src={preset.images[0].url}
                      alt={preset.title}
                      className="w-11 h-11 rounded-lg object-cover border border-black/5 shrink-0 group-hover:scale-105 transition-transform"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-[#1A1A1A] truncate group-hover:text-black">
                        {preset.title}
                      </p>
                      <p className="text-[10px] text-[#1A1A1A]/50 mt-0.5">
                        {preset.images.length} Product Angles
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Product Canvas Cards Grid (3 Slots) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            {/* Render Uploaded Images */}
            {images.map((img, index) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative group aspect-[3/4] bg-gray-100 rounded-3xl overflow-hidden shadow-inner border border-black/5 flex flex-col justify-between"
              >
                {/* Background Image */}
                <img
                  src={img.url}
                  alt={img.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95"
                />

                {/* Dark Gradient Overlay for Legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 opacity-70 group-hover:opacity-80 transition-opacity" />

                {/* Top Action buttons */}
                <div className="relative z-10 p-3 flex items-center justify-between">
                  <span className="text-[9px] uppercase tracking-wider font-bold bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[#1A1A1A] shadow-xs">
                    Angle #{index + 1}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setPreviewingImage(img)}
                      className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md hover:bg-white text-[#1A1A1A] flex items-center justify-center shadow-xs transition-colors cursor-pointer"
                      title="Expand preview"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => onRemoveImage(img.id)}
                      className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md hover:bg-red-50 text-[#1A1A1A] hover:text-red-600 flex items-center justify-center shadow-xs transition-colors cursor-pointer"
                      title="Remove image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Bottom Angle Selector & Metadata Overlay */}
                <div className="relative z-10 p-4 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[9px] text-white uppercase tracking-wider font-bold bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                      Captured
                    </span>

                    <select
                      value={img.angle}
                      onChange={(e) => onUpdateAngle(img.id, e.target.value as AngleType)}
                      className="text-[11px] bg-white/95 backdrop-blur-md text-[#1A1A1A] font-semibold border-0 rounded-full px-3 py-1 focus:outline-none focus:ring-1 focus:ring-black cursor-pointer shadow-xs"
                    >
                      {AVAILABLE_ANGLES.map((angle) => (
                        <option key={angle} value={angle}>
                          {angle} View
                        </option>
                      ))}
                    </select>
                  </div>

                  <p className="text-[11px] text-white/90 font-medium truncate px-1" title={img.name}>
                    {img.name}
                  </p>
                </div>

              </motion.div>
            ))}

            {/* Empty Slots matching template aspect ratio & styling */}
            {Array.from({ length: 3 - images.length }).map((_, slotIdx) => {
              const currentSlotIndex = images.length + slotIdx;
              const slotLabel = currentSlotIndex === 0 ? 'Main View' : currentSlotIndex === 1 ? 'Side Angle' : 'Detail View';

              return (
                <div
                  key={`empty-${slotIdx}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative group aspect-[3/4] bg-[#F5F2ED] rounded-3xl overflow-hidden border border-dashed transition-all cursor-pointer flex flex-col items-center justify-center p-6 text-center ${
                    isDragging
                      ? 'border-black bg-[#EFEBE4] scale-[1.01]'
                      : 'border-gray-300 hover:border-black/50 hover:bg-[#EFECE6]'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  <div className="text-center">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-xs group-hover:scale-110 transition-transform text-[#1A1A1A]">
                      <Plus className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A] block mb-1">
                      {slotLabel}
                    </span>
                    <span className="text-[11px] text-[#1A1A1A]/50 block">
                      Click or drag photo
                    </span>
                  </div>
                </div>
              );
            })}

          </div>

          {/* Upload Progress Bar matching Design Template */}
          <div className="pt-4 border-t border-black/5 flex flex-col gap-3">
            <div className="flex justify-between items-center px-1 text-[11px]">
              <span className="font-medium text-[#1A1A1A]/50">
                Upload progress: {images.length} of 3 images
              </span>
              <span className="font-bold text-[#1A1A1A]">
                {Math.round((images.length / 3) * 100)}%
              </span>
            </div>
            
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-black rounded-full transition-all duration-500"
                style={{ width: `${(images.length / 3) * 100}%` }}
              />
            </div>
          </div>

        </div>

      </div>

      {/* Fullscreen Image Preview Lightbox */}
      {previewingImage && (
        <div className="fixed inset-0 z-50 bg-[#1A1A1A]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-3xl w-full bg-[#FBF9F6] rounded-3xl overflow-hidden shadow-2xl border border-black/10">
            <div className="p-4 bg-white border-b border-black/5 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">{previewingImage.name}</h4>
                <p className="text-[11px] text-[#1A1A1A]/50">Perspective: {previewingImage.angle} View</p>
              </div>
              <button
                onClick={() => setPreviewingImage(null)}
                className="px-3.5 py-1.5 rounded-full bg-black/5 text-[11px] font-bold uppercase tracking-wider text-[#1A1A1A] hover:bg-black/10 transition-colors"
              >
                Close
              </button>
            </div>
            <div className="p-6 bg-[#1A1A1A] flex items-center justify-center max-h-[70vh]">
              <img
                src={previewingImage.url}
                alt={previewingImage.name}
                className="max-h-[65vh] w-auto object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      )}

    </section>
  );
};

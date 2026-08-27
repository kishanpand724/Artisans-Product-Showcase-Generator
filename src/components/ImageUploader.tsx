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
  RefreshCw,
  X,
  FileText,
  CheckCircle2,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ImageUploaderProps {
  images: ProductImage[];
  onAddImages: (files: File[]) => void;
  onReplaceImage: (id: string, file: File) => void;
  onRemoveImage: (id: string) => void;
  onUpdateAngle: (id: string, angle: AngleType) => void;
  onLoadPreset: (preset: PresetProduct) => void;
}

const AVAILABLE_ANGLES: AngleType[] = ['Front', 'Side', 'Detail', 'Back', 'Top', 'Angle View'];
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  onAddImages,
  onReplaceImage,
  onRemoveImage,
  onUpdateAngle,
  onLoadPreset,
}) => {
  const mainFileInputRef = useRef<HTMLInputElement>(null);
  const replaceFileInputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [errorMsgs, setErrorMsgs] = useState<string[]>([]);
  const [previewingImage, setPreviewingImage] = useState<ProductImage | null>(null);

  // Upload Progress simulation state
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingFileName, setProcessingFileName] = useState('');

  // Targeted replace tracking
  const [replacingId, setReplacingId] = useState<string | null>(null);

  const canUploadMore = images.length < 3;

  // Validate single file format and size
  const validateFile = (file: File): { valid: boolean; error?: string } => {
    const fileType = file.type.toLowerCase();
    const fileName = file.name;

    // Type check
    const isTypeValid = ALLOWED_MIME_TYPES.includes(fileType) || 
      fileType.startsWith('image/jpeg') || 
      fileType.startsWith('image/jpg') || 
      fileType.startsWith('image/png') || 
      fileType.startsWith('image/webp');

    if (!isTypeValid) {
      return {
        valid: false,
        error: `Invalid file format for "${fileName}". Only JPG, PNG, and WebP images are supported.`,
      };
    }

    // Size check (max 10MB)
    if (file.size > MAX_FILE_SIZE_BYTES) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      return {
        valid: false,
        error: `"${fileName}" (${sizeMb} MB) exceeds maximum allowed size of 10 MB.`,
      };
    }

    return { valid: true };
  };

  // Simulate progress bar for feedback
  const runUploadAnimation = (fileLabel: string, onComplete: () => void) => {
    setIsProcessing(true);
    setUploadProgress(0);
    setProcessingFileName(fileLabel);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 25;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsProcessing(false);
          setUploadProgress(0);
          setProcessingFileName('');
          onComplete();
        }, 150);
      }
    }, 70);
  };

  // Handle adding new files
  const processNewFiles = (files: File[]) => {
    setErrorMsgs([]);

    if (images.length >= 3) {
      setErrorMsgs(['Maximum limit of 3 product images reached. Remove or replace an image to upload a new angle.']);
      return;
    }

    const availableSlots = 3 - images.length;
    const selectedFiles = files.slice(0, availableSlots);
    const errors: string[] = [];
    const validFiles: File[] = [];

    if (files.length > availableSlots) {
      errors.push(`Only ${availableSlots} more slot(s) available. Extra files were excluded.`);
    }

    for (const file of selectedFiles) {
      const check = validateFile(file);
      if (check.valid) {
        validFiles.push(file);
      } else if (check.error) {
        errors.push(check.error);
      }
    }

    if (errors.length > 0) {
      setErrorMsgs(errors);
    }

    if (validFiles.length > 0) {
      const label = validFiles.length === 1 ? validFiles[0].name : `${validFiles.length} photos`;
      runUploadAnimation(label, () => {
        onAddImages(validFiles);
      });
    }
  };

  const handleMainFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processNewFiles(Array.from(e.target.files));
    }
    if (mainFileInputRef.current) {
      mainFileInputRef.current.value = '';
    }
  };

  // Handle replacing an existing image
  const triggerReplace = (id: string) => {
    setReplacingId(id);
    replaceFileInputRef.current?.click();
  };

  const handleReplaceFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && replacingId) {
      const file = e.target.files[0];
      const check = validateFile(file);

      if (!check.valid && check.error) {
        setErrorMsgs([check.error]);
      } else {
        setErrorMsgs([]);
        runUploadAnimation(`Replacing with "${file.name}"`, () => {
          onReplaceImage(replacingId, file);
          setReplacingId(null);
        });
      }
    }
    if (replaceFileInputRef.current) {
      replaceFileInputRef.current.value = '';
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

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processNewFiles(Array.from(e.dataTransfer.files));
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Preset image';
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFormatBadge = (fileType?: string) => {
    if (!fileType) return 'JPG';
    if (fileType.includes('png')) return 'PNG';
    if (fileType.includes('webp')) return 'WEBP';
    return 'JPG';
  };

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 mb-12">
      {/* Hidden File Inputs */}
      <input
        ref={mainFileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp"
        multiple
        onChange={handleMainFileChange}
        className="hidden"
      />
      <input
        ref={replaceFileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp"
        onChange={handleReplaceFileChange}
        className="hidden"
      />

      <div className="bg-white/80 backdrop-blur-md rounded-[32px] sm:rounded-[40px] border border-black/5 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] p-6 sm:p-10 flex flex-col">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-end mb-8 gap-4 border-b border-black/5 pb-6">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#1A1A1A]/40 block mb-1">
              Phase 2: Product Image Canvas
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-light text-[#1A1A1A]">
              Upload 2 to 3 Angles
            </h2>
            <p className="text-xs sm:text-[13px] text-[#1A1A1A]/50 mt-1">
              Validation active: JPG, PNG, WebP up to 10MB each.
            </p>
          </div>

          {/* Angle counter badges */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-semibold text-[#1A1A1A]/60">
              {images.length}/3 Perspectives
            </span>
            <div className="flex gap-1.5">
              <div className={`w-2.5 h-2.5 rounded-full transition-all ${images.length >= 1 ? 'bg-[#1A1A1A]' : 'bg-black/10'}`} />
              <div className={`w-2.5 h-2.5 rounded-full transition-all ${images.length >= 2 ? 'bg-[#1A1A1A]' : 'bg-black/10'}`} />
              <div className={`w-2.5 h-2.5 rounded-full transition-all ${images.length >= 3 ? 'bg-[#1A1A1A]' : 'bg-black/10'}`} />
            </div>
          </div>
        </div>

        {/* Main Content Body */}
        <div className="space-y-6">
          
          {/* Validation Error Messages Banner */}
          {errorMsgs.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-red-50/90 border border-red-200 text-red-900 text-xs flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[10px] text-red-700">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>Validation Warning</span>
                </div>
                <button 
                  onClick={() => setErrorMsgs([])} 
                  className="text-[10px] uppercase tracking-wider font-bold text-red-700 hover:text-red-950 underline cursor-pointer"
                >
                  Dismiss
                </button>
              </div>

              <ul className="list-disc list-inside space-y-1 text-xs pl-1">
                {errorMsgs.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Active Upload Processing Bar */}
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 rounded-2xl bg-[#F5F2ED] border border-black/5 flex flex-col gap-2"
            >
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-[#1A1A1A] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-black animate-ping" />
                  Processing {processingFileName}...
                </span>
                <span className="font-bold text-[#1A1A1A]">{uploadProgress}%</span>
              </div>
              <div className="w-full h-1.5 bg-black/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#1A1A1A] rounded-full transition-all duration-150"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </motion.div>
          )}

          {/* Presets Bar (when zero images loaded) */}
          {images.length === 0 && (
            <div className="p-5 rounded-2xl bg-[#F5F2ED] border border-black/5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#1A1A1A]/70 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Load Sample Artisan Products
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
                        {preset.images.length} Verified Angles
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sequential 3-Slot Product Canvas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            {/* Render Uploaded Images in Order */}
            {images.map((img, index) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative group aspect-[3/4] bg-gray-100 rounded-3xl overflow-hidden shadow-inner border border-black/5 flex flex-col justify-between"
              >
                {/* Image element */}
                <img
                  src={img.url}
                  alt={img.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/40 opacity-80 group-hover:opacity-90 transition-opacity" />

                {/* Top Toolbar Badges & Actions */}
                <div className="relative z-10 p-3 flex items-center justify-between">
                  <span className="text-[9px] uppercase tracking-wider font-bold bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[#1A1A1A] shadow-xs">
                    Slot #{index + 1}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {/* Expand Preview */}
                    <button
                      onClick={() => setPreviewingImage(img)}
                      className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md hover:bg-white text-[#1A1A1A] flex items-center justify-center shadow-xs transition-colors cursor-pointer"
                      title="Expand photo preview"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    {/* Replace Image Button */}
                    <button
                      onClick={() => triggerReplace(img.id)}
                      className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md hover:bg-white text-[#1A1A1A] hover:text-black flex items-center justify-center shadow-xs transition-colors cursor-pointer"
                      title="Replace photo"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                    
                    {/* Remove Image Button */}
                    <button
                      onClick={() => onRemoveImage(img.id)}
                      className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md hover:bg-red-50 text-[#1A1A1A] hover:text-red-600 flex items-center justify-center shadow-xs transition-colors cursor-pointer"
                      title="Remove photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Bottom Angle Selector & Metadata Controls */}
                <div className="relative z-10 p-4 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[9px] text-white uppercase tracking-wider font-bold bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                      {getFormatBadge(img.type)}
                    </span>

                    {/* Angle Dropdown Selector */}
                    <select
                      value={img.angle}
                      onChange={(e) => onUpdateAngle(img.id, e.target.value as AngleType)}
                      className="text-[11px] bg-white/95 backdrop-blur-md text-[#1A1A1A] font-bold border-0 rounded-full px-3 py-1 focus:outline-none focus:ring-1 focus:ring-black cursor-pointer shadow-xs"
                    >
                      {AVAILABLE_ANGLES.map((angle) => (
                        <option key={angle} value={angle}>
                          {angle} View
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="px-1 pt-1 flex items-center justify-between text-white/90">
                    <p className="text-[11px] font-medium truncate max-w-[150px]" title={img.name}>
                      {img.name}
                    </p>
                    <span className="text-[10px] text-white/60 font-mono shrink-0">
                      {formatFileSize(img.size)}
                    </span>
                  </div>
                </div>

              </motion.div>
            ))}

            {/* Empty Slots */}
            {Array.from({ length: 3 - images.length }).map((_, slotIdx) => {
              const slotNumber = images.length + slotIdx + 1;
              const isRequiredSlot = slotNumber <= 2;
              const slotLabel = slotNumber === 1 ? 'Front Perspective' : slotNumber === 2 ? 'Side Perspective' : 'Detail View (Optional)';

              return (
                <div
                  key={`empty-slot-${slotIdx}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => mainFileInputRef.current?.click()}
                  className={`relative group aspect-[3/4] bg-[#F5F2ED] rounded-3xl overflow-hidden border border-dashed transition-all cursor-pointer flex flex-col items-center justify-center p-6 text-center ${
                    isDragging
                      ? 'border-black bg-[#EFEBE4] scale-[1.01]'
                      : 'border-black/20 hover:border-black/60 hover:bg-[#EFECE6]'
                  }`}
                >
                  <div className="text-center">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-xs group-hover:scale-110 transition-transform text-[#1A1A1A]">
                      <Plus className="w-5 h-5" />
                    </div>
                    
                    <span className="text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A] block mb-1">
                      Slot #{slotNumber}: {slotLabel}
                    </span>
                    
                    <span className="text-[11px] text-[#1A1A1A]/50 block">
                      Click or drag photo here
                    </span>

                    <span className={`inline-block mt-2 text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${
                      isRequiredSlot ? 'bg-black/5 text-[#1A1A1A]/70' : 'bg-gray-200/60 text-gray-500'
                    }`}>
                      {isRequiredSlot ? 'Required Angle' : 'Optional Angle'}
                    </span>
                  </div>
                </div>
              );
            })}

          </div>

          {/* Requirement Status Bar */}
          <div className="pt-4 border-t border-black/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${images.length >= 2 ? 'bg-emerald-600' : 'bg-amber-500 animate-pulse'}`} />
              <span className="font-semibold text-[#1A1A1A]">
                {images.length >= 2 
                  ? `Validation satisfied: ${images.length} of 3 product angles saved in app state.`
                  : `Requirement: Upload at least 2 images of the product (${images.length}/2 min).`}
              </span>
            </div>

            <div className="text-[11px] text-[#1A1A1A]/50 font-medium">
              Supported formats: JPG, PNG, WebP (Max 10MB per file)
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
                <p className="text-[11px] text-[#1A1A1A]/50">Angle Tag: {previewingImage.angle} View • {formatFileSize(previewingImage.size)}</p>
              </div>
              <button
                onClick={() => setPreviewingImage(null)}
                className="px-3.5 py-1.5 rounded-full bg-black/5 text-[11px] font-bold uppercase tracking-wider text-[#1A1A1A] hover:bg-black/10 transition-colors cursor-pointer"
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

import React, { useState, useEffect } from 'react';
import { ProductImage, AngleType, PresetProduct, ShowcaseStyle } from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ImageUploader } from './components/ImageUploader';
import { GenerateAction } from './components/GenerateAction';
import { StyleSelector } from './components/StyleSelector';
import { ShowcasePreviewModal } from './components/ShowcasePreviewModal';
import { Footer } from './components/Footer';
import { generateStructuredPrompt } from './utils/promptGenerator';

export default function App() {
  const [images, setImages] = useState<ProductImage[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<ShowcaseStyle>('Minimal');
  const [extraInstructions, setExtraInstructions] = useState<string>('');
  const [showStyleSection, setShowStyleSection] = useState<boolean>(false);
  const [isShowcaseOpen, setIsShowcaseOpen] = useState<boolean>(false);

  // If image count drops below 2, hide the style selection phase
  useEffect(() => {
    if (images.length < 2 && showStyleSection) {
      setShowStyleSection(false);
    }
  }, [images.length, showStyleSection]);

  // Default angles helper based on current count
  const getDefaultAngle = (index: number): AngleType => {
    switch (index) {
      case 0:
        return 'Front';
      case 1:
        return 'Side';
      case 2:
        return 'Detail';
      default:
        return 'Angle View';
    }
  };

  const handleAddImages = (files: File[]) => {
    const newItems: ProductImage[] = files.map((file, idx) => {
      const currentTotal = images.length + idx;
      return {
        id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        url: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
        type: file.type,
        angle: getDefaultAngle(currentTotal),
        uploadedAt: new Date(),
      };
    });

    setImages((prev) => [...prev, ...newItems].slice(0, 3));
  };

  const handleReplaceImage = (id: string, file: File) => {
    setImages((prev) => {
      const existingIndex = prev.findIndex((img) => img.id === id);
      if (existingIndex === -1) return prev;

      const oldImg = prev[existingIndex];
      if (oldImg.url.startsWith('blob:')) {
        URL.revokeObjectURL(oldImg.url);
      }

      const updatedItem: ProductImage = {
        id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        url: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
        type: file.type,
        angle: oldImg.angle,
        uploadedAt: new Date(),
      };

      const newImages = [...prev];
      newImages[existingIndex] = updatedItem;
      return newImages;
    });
  };

  const handleRemoveImage = (id: string) => {
    setImages((prev) => {
      const itemToRemove = prev.find((img) => img.id === id);
      if (itemToRemove && itemToRemove.url.startsWith('blob:')) {
        URL.revokeObjectURL(itemToRemove.url);
      }
      return prev.filter((img) => img.id !== id);
    });
  };

  const handleUpdateAngle = (id: string, angle: AngleType) => {
    setImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, angle } : img))
    );
  };

  const handleLoadPreset = (preset: PresetProduct) => {
    const presetImages: ProductImage[] = preset.images.map((item, idx) => ({
      id: `preset-${preset.id}-${idx}`,
      url: item.url,
      name: item.name,
      angle: item.angle,
      uploadedAt: new Date(),
    }));
    setImages(presetImages);
    setShowStyleSection(true);
  };

  const handleReset = () => {
    images.forEach((img) => {
      if (img.url.startsWith('blob:')) {
        URL.revokeObjectURL(img.url);
      }
    });
    setImages([]);
    setShowStyleSection(false);
    setSelectedStyle('Minimal');
    setExtraInstructions('');
  };

  const handleContinueToStyle = () => {
    setShowStyleSection(true);
    setTimeout(() => {
      const el = document.getElementById('style-selection');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const generatedPrompt = generateStructuredPrompt(selectedStyle, extraInstructions, images);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2C2825] flex flex-col justify-between selection:bg-[#E2D4C3] selection:text-[#1F1B18]">
      
      {/* Top Header */}
      <Header imageCount={images.length} onReset={handleReset} />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero />

        {/* Phase 2: Upload Product Images Section */}
        <ImageUploader
          images={images}
          onAddImages={handleAddImages}
          onReplaceImage={handleReplaceImage}
          onRemoveImage={handleRemoveImage}
          onUpdateAngle={handleUpdateAngle}
          onLoadPreset={handleLoadPreset}
        />

        {/* Action Section: Continue to Style Selection */}
        <GenerateAction
          imageCount={images.length}
          onGenerateShowcase={handleContinueToStyle}
        />

        {/* Phase 3: Style Selection & Prompt Generation Section */}
        {showStyleSection && images.length >= 2 && (
          <StyleSelector
            images={images}
            selectedStyle={selectedStyle}
            onSelectStyle={setSelectedStyle}
            extraInstructions={extraInstructions}
            onChangeExtraInstructions={setExtraInstructions}
            onGenerateShowcase={() => setIsShowcaseOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Showcase Modal triggered by "Generate Showcase" button */}
      {isShowcaseOpen && (
        <ShowcasePreviewModal
          images={images}
          selectedStyle={selectedStyle}
          extraInstructions={extraInstructions}
          generatedPrompt={generatedPrompt}
          onClose={() => setIsShowcaseOpen(false)}
        />
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { ProductImage, AngleType, PresetProduct } from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ImageUploader } from './components/ImageUploader';
import { GenerateAction } from './components/GenerateAction';
import { ShowcasePreviewModal } from './components/ShowcasePreviewModal';
import { Footer } from './components/Footer';

export default function App() {
  const [images, setImages] = useState<ProductImage[]>([]);
  const [isShowcaseOpen, setIsShowcaseOpen] = useState<boolean>(false);

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
  };

  const handleReset = () => {
    images.forEach((img) => {
      if (img.url.startsWith('blob:')) {
        URL.revokeObjectURL(img.url);
      }
    });
    setImages([]);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2C2825] flex flex-col justify-between selection:bg-[#E2D4C3] selection:text-[#1F1B18]">
      
      {/* Top Header */}
      <Header imageCount={images.length} onReset={handleReset} />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero />

        {/* Upload Product Images Section */}
        <ImageUploader
          images={images}
          onAddImages={handleAddImages}
          onRemoveImage={handleRemoveImage}
          onUpdateAngle={handleUpdateAngle}
          onLoadPreset={handleLoadPreset}
        />

        {/* Generate Showcase Button Action Section */}
        <GenerateAction
          imageCount={images.length}
          onGenerateShowcase={() => setIsShowcaseOpen(true)}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Showcase Modal triggered by active Generate Showcase button */}
      {isShowcaseOpen && (
        <ShowcasePreviewModal
          images={images}
          onClose={() => setIsShowcaseOpen(false)}
        />
      )}
    </div>
  );
}

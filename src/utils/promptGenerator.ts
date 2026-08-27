import { ProductImage, ShowcaseStyle, StyleOption } from '../types';

export const STYLE_OPTIONS: StyleOption[] = [
  {
    id: 'Minimal',
    title: 'Minimal',
    tagline: 'Clean background & soft lighting',
    description: 'Focuses entirely on the craftsmanship with an uncluttered, seamless backdrop, soft studio shadows, and ultra-clean composition.',
    background: 'Clean neutral background (soft off-white/beige tone)',
    lighting: 'Soft diffused studio lighting',
    composition: 'Simple, centered, high-clarity professional composition',
    colorBadge: 'bg-[#F0EBE1] text-[#1A1A1A] border-black/10',
    bgGradient: 'from-[#FDFBF7] to-[#F5F2EC]',
  },
  {
    id: 'Premium',
    title: 'Premium',
    tagline: 'Luxury background & cinematic lighting',
    description: 'Elevates the product with sophisticated architectural textures, dramatic rim lighting, gold or polished stone accents, and high-end editorial staging.',
    background: 'Luxury architectural background with dark marble, bronze, or stone textures',
    lighting: 'Dramatic cinematic studio lighting with sharp highlights and rich depth',
    composition: 'Elegant editorial showcase staging with dynamic depth of field',
    colorBadge: 'bg-[#1A1A1A] text-white border-black',
    bgGradient: 'from-[#2A2624] to-[#1A1A1A]',
  },
  {
    id: 'Traditional',
    title: 'Traditional',
    tagline: 'Culturally inspired & warm natural lighting',
    description: 'Roots the product in authentic heritage with warm golden-hour tones, raw linen, teak wood, and hand-crafted decorative textures.',
    background: 'Culturally inspired background featuring warm raw linen, carved wood, or terracota textures',
    lighting: 'Warm golden-hour natural sunlight casting gentle soft shadows',
    composition: 'Authentic artisanal environment composition highlighting raw material harmony',
    colorBadge: 'bg-[#E3D7C5] text-[#3D2C1E] border-[#8C6D53]/30',
    bgGradient: 'from-[#F7F2EB] to-[#EFE7DC]',
  },
];

export function generateStructuredPrompt(
  selectedStyle: ShowcaseStyle,
  extraInstructions: string,
  images: ProductImage[]
): string {
  const styleOpt = STYLE_OPTIONS.find((s) => s.id === selectedStyle) || STYLE_OPTIONS[0];

  const anglesText = images.length > 0
    ? images.map((img) => `${img.angle} view (${img.name})`).join(', ')
    : 'Multi-angle perspectives';

  let prompt = `Create a high-resolution, professional product showcase image based on the uploaded reference photos [${anglesText}].\n\n`;

  prompt += `1. PRODUCT PRESERVATION:\n`;
  prompt += `- Preserve the product's original identity, shape, proportions, colors, patterns, materials, and fine craftsmanship details exactly as shown in the reference photos.\n`;
  prompt += `- Do NOT make unnecessary changes, distortions, or modifications to the core product itself.\n\n`;

  prompt += `2. VISUAL STYLE & SETTING (${selectedStyle.toUpperCase()}):\n`;
  prompt += `- Background: ${styleOpt.background}.\n`;
  prompt += `- Lighting: ${styleOpt.lighting}.\n`;
  prompt += `- Composition: ${styleOpt.composition}.\n\n`;

  prompt += `3. SHOWCASE QUALITY:\n`;
  prompt += `- Render in pristine commercial quality with sharp focal focus, natural shadows, and rich physical textures.\n`;

  if (extraInstructions && extraInstructions.trim().length > 0) {
    prompt += `\n4. EXTRA USER INSTRUCTIONS:\n`;
    prompt += `- ${extraInstructions.trim()}`;
  }

  return prompt;
}

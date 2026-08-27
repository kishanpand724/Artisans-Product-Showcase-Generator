import { PresetProduct } from '../types';

export const SAMPLE_PRESETS: PresetProduct[] = [
  {
    id: 'ceramic-pitcher',
    title: 'Terracotta & Glaze Pitcher',
    category: 'Ceramics & Pottery',
    craftsman: 'Studio Earth & Vessel',
    description: 'Hand-thrown stoneware pitcher with reactive stone glaze and ergonomic looped handle.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80',
        name: 'terracotta-pitcher-front.jpg',
        angle: 'Front',
      },
      {
        url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
        name: 'terracotta-pitcher-profile.jpg',
        angle: 'Side',
      },
      {
        url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80',
        name: 'terracotta-pitcher-texture.jpg',
        angle: 'Detail',
      },
    ],
  },
  {
    id: 'leather-bag',
    title: 'Heritage Full-Grain Leather Brief',
    category: 'Leather Craft',
    craftsman: 'Atelier Vance & Co.',
    description: 'Vegetable-tanned leather carryall stitched with waxed linen thread and solid brass hardware.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
        name: 'leather-brief-front.jpg',
        angle: 'Front',
      },
      {
        url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
        name: 'leather-brief-side.jpg',
        angle: 'Side',
      },
    ],
  },
  {
    id: 'walnut-bowl',
    title: 'Live-Edge Carved Walnut Bowl',
    category: 'Woodworking',
    craftsman: 'Kestrel Woodcraft',
    description: 'Single-block black walnut bowl hand-lathed and sealed with organic beeswax finish.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
        name: 'walnut-bowl-top.jpg',
        angle: 'Top',
      },
      {
        url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
        name: 'walnut-bowl-side.jpg',
        angle: 'Side',
      },
      {
        url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80',
        name: 'walnut-bowl-detail.jpg',
        angle: 'Detail',
      },
    ],
  },
];

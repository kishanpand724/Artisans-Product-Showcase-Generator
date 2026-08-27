export type AngleType = 'Front' | 'Side' | 'Back' | 'Detail' | 'Top' | 'Angle View';

export type ShowcaseStyle = 'Minimal' | 'Premium' | 'Traditional';

export interface StyleOption {
  id: ShowcaseStyle;
  title: string;
  tagline: string;
  description: string;
  background: string;
  lighting: string;
  composition: string;
  colorBadge: string;
  bgGradient: string;
}

export interface ProductImage {
  id: string;
  url: string;
  name: string;
  size?: number;
  type?: string;
  angle: AngleType;
  uploadedAt: Date;
}

export interface PresetProduct {
  id: string;
  title: string;
  category: string;
  description: string;
  craftsman: string;
  images: {
    url: string;
    name: string;
    angle: AngleType;
  }[];
}


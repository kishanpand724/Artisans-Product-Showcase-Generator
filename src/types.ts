export type AngleType = 'Front' | 'Side' | 'Back' | 'Detail' | 'Top' | 'Angle View';

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

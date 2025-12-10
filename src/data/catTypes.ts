// src/data/catTypes.ts

export interface CatDetailItem {
  label: string;
  value: string;
}

// This is the "base" info you write in each cat file
export interface CatBase {
  slug: string;
  name: string;
  intro: string;
  paragraphs: string[];
  details: CatDetailItem[];
  videoId?: string;
}

export interface CatImage {
  src: string;
  alt: string;
}

// This is what the app actually uses (base + images)
export interface Cat extends CatBase {
  carouselImages: CatImage[];
}

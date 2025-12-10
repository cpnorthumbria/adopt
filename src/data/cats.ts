// src/data/cats.ts
import type { CatBase, Cat, CatImage } from "./catTypes";

// 1) Load base cat data from src/data/cats/*.ts
// Each file must export `default` with { slug, name, intro, paragraphs, details }
const dataModules = import.meta.glob("./cats/*.ts", {
  eager: true
});

// 2) Load images from src/assets/cats/*/*.{jpg,jpeg,png,webp}
// Use query/import instead of deprecated `as: 'url'`
const imageModules = import.meta.glob("../assets/cats/*/*.{jpg,jpeg,png,webp}", {
  eager: true,
  query: "?url",
  import: "default"
}) as Record<string, string>;

type ImageEntry = {
  slug: string;
  fileName: string;
  src: string;
};

const imagesBySlug = new Map<string, ImageEntry[]>();

for (const [path, src] of Object.entries(imageModules)) {
  // Example path: "../assets/cats/bonzo/bonzo1.jpg"
  const parts = path.split("/");
  const fileName = parts[parts.length - 1]; // "bonzo1.jpg"
  const slug = parts[parts.length - 2];     // "bonzo"

  const entry: ImageEntry = { slug, fileName, src };
  const list = imagesBySlug.get(slug) ?? [];
  list.push(entry);
  imagesBySlug.set(slug, list);
}

// Sort images by filename so bonzo1, bonzo2, bonzo3 are in order
for (const [slug, list] of imagesBySlug) {
  list.sort((a, b) => a.fileName.localeCompare(b.fileName));
}

function buildCarouselImages(slug: string, name: string): CatImage[] {
  const entries = imagesBySlug.get(slug) ?? [];
  if (!entries.length) return [];

  return entries.map((entry, index) => ({
    src: entry.src,
    alt:
      entries.length === 1
        ? name
        : `${name} (${index + 1})`
  }));
}

// Convert data modules into CatBase[]
const baseCats: CatBase[] = Object.values(dataModules).map((mod: any) => {
  return mod.default as CatBase;
});

// Build final Cat[] with carouselImages added automatically
export const cats: Cat[] = baseCats.map((base) => ({
  ...base,
  carouselImages: buildCarouselImages(base.slug, base.name)
}));

// Re-export the Cat type so components can import from "../data/cats"
export type { Cat } from "./catTypes";

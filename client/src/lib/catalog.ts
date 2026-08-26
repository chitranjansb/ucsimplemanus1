export type ProductCategory = string;

import type { ImageFocalPoint } from "@/lib/imageFocal";
import { backupCollections, backupProducts } from "@/lib/catalogBackup";

export type Product = {
  id: string;
  databaseId?: number;
  sku?: string | null;
  productCode?: string | null;
  slug?: string;
  name: string;
  collection: string;
  collectionSlug?: string | null;
  category: ProductCategory;
  categories?: Array<{ slug: string; name: string; primary: boolean }>;
  material: string;
  materials?: string[];
  finish?: string | null;
  finishes?: string[];
  description: string;
  shortDescription?: string | null;
  dimensions: string;
  weightKg?: number | null;
  moq?: number | null;
  packagingInfo?: string | null;
  cbm?: number | null;
  customizable?: boolean;
  status?: "draft" | "published" | "archived";
  availability?: "available" | "on_request" | "discontinued";
  image: string;
  imageAlt: string;
  /** Sets product placement inside fixed editorial frames; values are percentages from the image’s top-left corner. */
  imageFocal?: ImageFocalPoint;
  featured?: boolean;
  isNew?: boolean;
  seoTitle?: string | null;
  seoDescription?: string | null;
  media?: Array<{ id: number; url: string; alt: string; role: "hero" | "gallery" | "detail"; sortOrder: number; focal: ImageFocalPoint }>;
  specifications?: Array<{ key: string; label: string; value: string; unit: string | null; sortOrder: number; variantCode: string | null }>;
  variants?: Array<{ variantCode: string; sku: string | null; name: string | null; material: string | null; finish: string | null; dimensions: string | null; weightKg: number | null; moq: number | null; packagingInfo: string | null; cbm: number | null; availability: "available" | "on_request" | "discontinued" }>;
};

export const collections = backupCollections;

export const products: Product[] = backupProducts;

/** Compatibility aliases for public links created before the backup catalogue import. */
export const legacyProductAliases: Record<string, string> = {
  "carved-storage-cabinet": "cabinet-with-two-drawer",
  "accent-side-table": "side-table",
  "patterned-sideboard": "sideboard-with-two-door-and-drawers",
  "wooden-chest": "storage-box",
  "carved-cabinet": "iron-fitted-carving-wooden-cabinet",
};

export function resolveProductId(id: string) {
  return legacyProductAliases[id] || id;
}

export function getCanonicalProductPath(id: string) {
  return `/collections/${resolveProductId(id)}`;
}

export const productCategories = ["All", "Dining", "Living", "Bedroom", "Bathroom", "Outdoor", "Storage"] as const;

export function getProduct(id: string) {
  return products.find((product) => product.id === resolveProductId(id));
}

export function getRelatedProducts(product: Product) {
  return products.filter((candidate) => candidate.id !== product.id && candidate.category === product.category).slice(0, 3);
}

export type CatalogueSort = "featured" | "newest" | "name_asc" | "name_desc";
export type CatalogueFilters = { query?: string; collection?: string; category?: string; material?: string; finish?: string; availability?: Product["availability"]; customizable?: boolean; isNew?: boolean; featured?: boolean; sort?: CatalogueSort };

function slugify(value: string) { return value.trim().toLowerCase().replace(/\s+/g, "-"); }

export function filterCatalogueProducts(filters: CatalogueFilters = {}, catalogue: Product[] = products) {
  const normalizedQuery = filters.query?.trim().toLowerCase() || "";
  const filtered = catalogue.filter((product) => {
    const productCollectionSlug = product.collectionSlug || slugify(product.collection);
    const materialText = [product.material, ...(product.materials || [])].join(" ");
    const finishText = [product.finish || "", ...(product.finishes || [])].join(" ");
    const searchText = [product.name, product.sku || "", product.productCode || "", product.collection, product.category, materialText, finishText].join(" ").toLowerCase();
    return (!filters.collection || productCollectionSlug === filters.collection) && (!filters.category || product.category.toLowerCase() === filters.category.toLowerCase() || product.categories?.some((category) => category.slug === filters.category)) && (!filters.material || materialText.toLowerCase().includes(filters.material.replace(/-/g, " ").toLowerCase())) && (!filters.finish || finishText.toLowerCase().includes(filters.finish.replace(/-/g, " ").toLowerCase())) && (!filters.availability || product.availability === filters.availability) && (filters.customizable === undefined || product.customizable === filters.customizable) && (filters.isNew === undefined || product.isNew === filters.isNew) && (filters.featured === undefined || product.featured === filters.featured) && (!normalizedQuery || searchText.includes(normalizedQuery));
  });
  return [...filtered].sort((a, b) => filters.sort === "name_desc" ? b.name.localeCompare(a.name) : filters.sort === "name_asc" ? a.name.localeCompare(b.name) : filters.sort === "newest" ? Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)) || a.name.localeCompare(b.name) : Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)) || a.name.localeCompare(b.name));
}

export function filterProducts(query: string, category: (typeof productCategories)[number], catalogue: Product[] = products, collectionSlug?: string) {
  return filterCatalogueProducts({ query, category: category === "All" ? undefined : category, collection: collectionSlug }, catalogue);
}

export function getProductGallery(product: Product) {
  return [{ src: product.image, alt: product.imageAlt, focal: product.imageFocal }];
}

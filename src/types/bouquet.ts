export interface SavedFlower {
  flowerName: string;
  flower_type_id: number;
  x: number;
  y: number;
  zIndex: number;
  scale: number;
  rotation: number;
  currentAngle: number;
  saturation: number;
  isFlipped?: boolean;
}

export interface Bouquet {
  id: string;
  name: string;
  createdAt: string;
  lastModified: string;
  flowers: SavedFlower[];
}

export interface BouquetInfo {
  id: string;
  name: string;
  createdAt: string;
  lastModified: string;
  flowerCount: number;
}
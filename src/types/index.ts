export type FlowerType = { // это просто цветок (не тип цветка, как flower_types.ts, название неудачное)
  id: string;
  name: string;
  image: HTMLImageElement | null;
  width: number; // 1600
  height: number; // ~430
  x: number;
  y: number;
  zIndex: number;
  scale: number;
  rotation: number;
  currentAngle: number;
  saturation: number;
  isFlipped?: boolean;
  flower_type_id: number;
  angles: {
    width: number;
    height: number;
  };
};
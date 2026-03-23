export type FlowerType = { // цветок на холсте - главный тип
  id: string;
  name: string;
  image: HTMLImageElement | null;
  width: number;
  height: number;
  x: number;
  y: number;
  zIndex: number;
  scale: number;
  rotation: number;
  currentAngle: number;
  angles: {
    width: number;
    height: number;
  };
};
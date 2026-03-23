// типы для панели фильтров
export interface FilterPanelProps {
  width?: number;
}
// и для сегментов на круге Иттена
export type ColorSegment = {
  colorName: string;
  colorRgb: string;
  colorId: number;
  xMult: number;
  yMult: number;
  checked: boolean;
};

export interface FilterPanelProps {
  width?: number;
  children?: React.ReactNode;
}
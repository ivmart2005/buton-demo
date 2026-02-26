export interface FilterPanelProps {
  width?: number;
}

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
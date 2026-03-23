export interface CatalogProps {
  width?: string;
  children?: React.ReactNode;
}

export interface ResizerProps {
  isOpen: boolean;
  currentWidth: string;
  onWidthChange: (width: string) => void;
  minWidth: number;
  maxWidth: number;
}

export interface FlowersListProps {
  selectedColors?: number[];
}
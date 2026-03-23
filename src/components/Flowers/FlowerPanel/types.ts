export type FlowerPanelProps = {
  width: number;
  height: number;
  visible: boolean;
  flowerId: string;
  onAngleChange: (angleIndex: number) => void;
  onRotationChange: (rotation: number) => void;
  onSaturationChange: (saturation: number) => void;
  onDelete: () => void;
  onMirror?: () => void;
  onDuplicate?: () => void;
  onReset?: () => void;
  currentScale: number;
  currentRotation: number;
  currentSaturation: number;
  style?: React.CSSProperties;
};

export type AngleButtonsProps = {
  width: number;
  onAngleChange: (angleIndex: number) => void;
};

export type LayerControlProps = {
  currentFlowerId: string;
  onFlowerSelect: (flowerId: string) => void;
};
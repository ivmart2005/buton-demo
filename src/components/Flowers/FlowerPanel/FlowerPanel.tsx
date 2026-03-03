import { AngleButtons } from './AngleButtons';
import { LayerControl } from './LayerControl';
import { SaturationSlider } from './SaturationSlider';
import { BottomFlowerControls } from './BottomFlowerControls';
import './FlowerPanel.css';

interface FlowerPanelProps {
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
}

export function FlowerPanel({
  width = 0,
  height = 0,
  visible,
  flowerId,
  onAngleChange,
  onRotationChange,
  onSaturationChange,
  onDelete,
  onMirror,
  onDuplicate,
  onReset,
  currentRotation,
  currentSaturation = 1.0,
  style
}: FlowerPanelProps) {
  if (!visible) return null;

  return (
    <div
      data-flower-panel={flowerId}
      className="flower-panel"
      style={{ width, height, ...style }}
      onClick={(event) => event.stopPropagation()}
    >
      <div className="flower-panel-container">
        <div className="layers-column left">
          <LayerControl currentFlowerId={flowerId} />
        </div>
        
        <div className="controls-column">
          <AngleButtons 
            width={width} 
            onAngleChange={onAngleChange}
          />
          
          <div className="saturation-section">
            <SaturationSlider 
              saturation={currentSaturation}
              onSaturationChange={onSaturationChange}
            />
          </div>

          <BottomFlowerControls 
            width={width}
            onMirror={onMirror}
            onDuplicate={onDuplicate}
            onReset={onReset}
            onDelete={onDelete}
          />
        </div>
      </div>
    </div>
  );
}
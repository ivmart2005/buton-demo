import './ColorWheelControls.css';

interface ColorWheelControlsProps {
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

export const ColorWheelControls = ({ onSelectAll, onDeselectAll }: ColorWheelControlsProps) => {
  return (
    <div className="color-wheel-controls">
      <button 
        className="color-control-button select-all"
        onClick={onSelectAll}
      >
        Выбрать все цвета
      </button>
      <button 
        className="color-control-button deselect-all"
        onClick={onDeselectAll}
      >
        Снять все цвета
      </button>
    </div>
  );
};
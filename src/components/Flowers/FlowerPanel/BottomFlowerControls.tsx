import './BottomFlowerControls.css';

interface BottomFlowerControlsProps {
  width: number;
  onMirror: () => void;
  onDuplicate: () => void;
  onReset: () => void;
  onDelete: () => void;
}

export const BottomFlowerControls = ({ 
  width, 
  onMirror,
  onDuplicate, 
  onReset, 
  onDelete 
}: BottomFlowerControlsProps) => {
  const buttonSize = Math.min(40, (width - 20) / 4);
  const buttonSpacing = (width - (buttonSize * 4)) / 5;

  return (
    <div 
      className="bottom-controls-container"
      style={{
        padding: `0 ${buttonSpacing}px`,
      }}
    >
      <button className="control-button" onClick={onMirror}>
        <img
          src="./images/interface/mirror-icon.svg"
          alt="Отразить"
          className="control-icon"
        />
        <img
          src="./images/interface/mirror-icon-pressed.svg"
          alt="Отразить"
          className="control-icon icon-pressed"
        />
      </button>
      <button className="control-button" onClick={onDuplicate}>
        <img
          src="./images/interface/dublicate-icon.svg"
          alt="Дублировать"
          className="control-icon"
        />
        <img
          src="./images/interface/dublicate-icon-pressed.svg"
          alt="Дублировать"
          className="control-icon icon-pressed"
        />
      </button>
      <button className="control-button" onClick={onReset}>
        <img
          src="./images/interface/reset-icon.svg"
          alt="Сбросить"
          className="control-icon"
        />
        <img
          src="./images/interface/reset-icon-pressed.svg"
          alt="Сбросить"
          className="control-icon icon-pressed"
        />
      </button>
      <button className="control-button" onClick={onDelete}>
        <img
          src="./images/interface/delete-icon.svg"
          alt="Удалить"
          className="control-icon"
        />
        <img
          src="./images/interface/delete-icon-pressed.svg"
          alt="Удалить"
          className="control-icon icon-pressed"
        />
      </button>
    </div>
  );
}
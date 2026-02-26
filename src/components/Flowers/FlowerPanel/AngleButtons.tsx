import './AngleButtons.css';
import { useState } from 'react';

interface AngleButtonsProps {
  width: number;
  onAngleChange: (angleIndex: number) => void;
}

export const AngleButtons = ({ width, onAngleChange }: AngleButtonsProps) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  // адаптив на 4 кнопки по всей ширине
  const buttonSize = Math.min(40, (width - 20) / 4);
  const buttonSpacing = (width - (buttonSize * 4)) / 5;
  // 4 слоя
  const angles = [0, 30, 60, 90]; // !! заменить на иконки
  const handleButtonClick = (angleIndex: number) => {
    setActiveIndex(angleIndex);
    onAngleChange(angleIndex);
  };

  return (
    <div 
      className="angle-buttons-container"
      style={{
        padding: `0 ${buttonSpacing}px`
      }}
    >
      {angles.map((angle, index) => (
        <button
          key={angle}
          className={`angle-button ${index === activeIndex ? 'active' : ''}`}
          onClick={() => handleButtonClick(index)}
          style={{
            width: `${buttonSize}px`,
            height: `${buttonSize}px`
          }}
        >
          {angle}
        </button>
      ))}
    </div>
  );
};
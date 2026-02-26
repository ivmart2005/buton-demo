import { useState } from 'react';
import './FlowerPanel.css';

export const RotationControl = ({
  height,
  currentRotation,
  onRotationChange
}: {
  height: number;
  currentRotation: number;
  onRotationChange: (rotation: number) => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const delta = e.deltaY > 0 ? -5 : 5;
    onRotationChange((currentRotation + delta) % 360);
  };

  return (
    <div 
      data-rotation-area
      className={`rotation-control ${isHovered ? 'hovered' : ''}`}
      style={{ height: `${height / 2 - 20}px` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onWheel={handleWheel}
    >
      <div style={{ textAlign: 'center' }}>
        <div>Зона вращения</div>
      </div>
    </div>
  );
};
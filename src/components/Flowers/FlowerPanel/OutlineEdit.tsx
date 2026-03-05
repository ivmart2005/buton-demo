import { FlowerType } from '@/types';
import './OutlineEdit.css';

interface OutlineEditProps {
  flower: FlowerType;
  isActive: boolean;
  onRotationStart: (e: React.MouseEvent) => void;
  isRotating: boolean;
}

export const OutlineEdit = ({ flower, isActive, onRotationStart, isRotating }: OutlineEditProps) => {
  if (!isActive) return null;

  return (
    <div 
      className="outline-edit"
      data-outline-id={flower.id}
      style={{
        position: 'absolute',
        left: flower.x - 8, // по 8 отступ с каждой стороны
        top: flower.y - 8,
        width: flower.angles.width * flower.scale + 16, // 8 + 8 = 16
        height: flower.angles.height * flower.scale + 16,
        pointerEvents: 'none', // без этого ресайз колёсиком не работает
        transform: `rotate(${flower.rotation}deg)`,
        transformOrigin: 'center center'
      }}
    >
      <div className="outline-border" /> {/* декоративная квадратная рамка */}
      <div 
        className={`rotation-handle ${isRotating ? 'rotating' : ''}`}
        style={{
          position: 'absolute',
          top: -52,
          left: '50%',
          transform: 'translateX(-50%)',
          pointerEvents: 'auto', // без этого вращение не работает
          cursor: isRotating ? 'grabbing' : 'grab'
        }}
        onMouseDown={onRotationStart}
      >
        <div className="rotation-circle" />
      </div>
    </div>
  );
};
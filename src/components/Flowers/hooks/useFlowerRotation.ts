import { useState, useEffect, RefObject } from 'react';
import { FlowerType } from '@/types';

export const useFlowerRotation = (
  flower: FlowerType,
  updateFlower: (id: string, updates: Partial<FlowerType>) => void,
  isGlobalDrag: boolean,
  canvasRef: RefObject<HTMLCanvasElement | null>
) => {
  const [isRotating, setIsRotating] = useState(false);
  const [rotationOffset, setRotationOffset] = useState(0);

  const handleRotationStart = (event: React.MouseEvent) => {
    if (isGlobalDrag)
      return;
    setIsRotating(true);
    event.preventDefault();
    event.stopPropagation();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect)
      return;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const startAngle = Math.atan2(
      event.clientY - centerY,
      event.clientX - centerX
    ) * (180 / Math.PI);
    setRotationOffset(startAngle - flower.rotation);
  };

  useEffect(() => {
    if (!isRotating)
      return;
    
    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect)
        return;
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const currentAngle = Math.atan2(
        event.clientY - centerY,
        event.clientX - centerX
      ) * (180 / Math.PI);
      const newRotation = (currentAngle - rotationOffset + 360) % 360;
      updateFlower(flower.id, { rotation: newRotation });
    };

    const handleMouseUp = () => {
      setIsRotating(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isRotating, rotationOffset, flower.id, updateFlower, canvasRef]);

  return {
    isRotating,
    handleRotationStart
  };
};
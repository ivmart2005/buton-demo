import { useState, useEffect } from 'react';
import { FlowerType } from '@/types';

export const useGlobalDrag = (
  updateAllFlowers: (updater: (flower: FlowerType) => Partial<FlowerType>) => void
) => {
  const [isMiddleButtonDown, setIsMiddleButtonDown] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: MouseEvent) => {
    if (e.button === 1) {
      setIsMiddleButtonDown(true);
      setDragOffset({ x: e.clientX, y: e.clientY });
      e.preventDefault();
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isMiddleButtonDown) {
      const deltaX = e.clientX - dragOffset.x;
      const deltaY = e.clientY - dragOffset.y;
      
      updateAllFlowers(flower => ({
        x: flower.x + deltaX,
        y: flower.y + deltaY
      }));
      
      setDragOffset({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsMiddleButtonDown(false);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isMiddleButtonDown, dragOffset]);

  return {
    isMiddleButtonDown,
    dragHandlers: {
      onMouseDown: (e: React.MouseEvent) => handleMouseDown(e.nativeEvent),
      onWheel: (e: React.WheelEvent) => e.preventDefault()
    }
  };
};
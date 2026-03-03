import { useState, useEffect } from 'react';
import { FlowerType } from '@/types';

export const useFlowerDrag = (
  flower: FlowerType,
  updateFlower: (id: string, updates: Partial<FlowerType>) => void,
  isGlobalDrag: boolean,
  isRotating: boolean,
  canvasRef: React.RefObject<HTMLCanvasElement | null>
) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent, allFlowers: FlowerType[], setDebugInfo: (info: string) => void) => {
    if (isGlobalDrag || isRotating || e.button !== 0) return;

    for (let i = allFlowers.length - 1; i >= 0; i--) {
      const currentFlower = allFlowers[i];
      const currentCanvas = document.querySelector(`[data-flower-id="${currentFlower.id}"]`) as HTMLCanvasElement;
      if (!currentCanvas) continue;

      const rect = currentCanvas.getBoundingClientRect();
      const context = currentCanvas.getContext('2d');
      if (!context) continue;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (x >= 0 && y >= 0 && x < rect.width && y < rect.height) {
        const pixel = context.getImageData(x, y, 1, 1).data;
        if (pixel[3] > 10) {
          if (currentFlower.id === flower.id) {
            setIsDragging(true);
            setDragOffset({
              x: e.clientX - flower.x,
              y: e.clientY - flower.y
            });
          } else {
            currentCanvas.dispatchEvent(new MouseEvent('mousedown', {
              clientX: e.clientX,
              clientY: e.clientY,
              bubbles: true
            }));
          }
          e.stopPropagation();
          return;
        }
      }
    }
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      updateFlower(flower.id, {
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, flower.id, updateFlower]);

  return {
    isDragging,
    handleMouseDown
  };
};
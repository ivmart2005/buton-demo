import { useState, useEffect } from 'react';
import { FlowerType } from '@/types';

export const useFlowerInteractions = (
  flower: FlowerType,
  allFlowers: FlowerType[],
  updateFlower: (id: string, updates: Partial<FlowerType>) => void,
  isGlobalDrag: boolean,
  isRotating: boolean
) => {
  const [showPanel, setShowPanel] = useState(false);

  const handleContextMenu = (e: React.MouseEvent) => {
    if (isGlobalDrag || isRotating) return;
    e.preventDefault();
    
    for (let i = allFlowers.length - 1; i >= 0; i--) {
      const currentFlower = allFlowers[i];
      const currentCanvas = document.querySelector(`[data-flower-id="${currentFlower.id}"]`) as HTMLCanvasElement;
      if (!currentCanvas) continue;

      const rect = currentCanvas.getBoundingClientRect();
      const ctx = currentCanvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) continue;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (x >= 0 && y >= 0 && x < rect.width && y < rect.height) {
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        if (pixel[3] > 10) {
          if (currentFlower.id === flower.id) {
            setShowPanel(true);
          } else {
            currentCanvas.dispatchEvent(new MouseEvent('contextmenu', {
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
    
    setShowPanel(false);
  };

  const handleWheel = (e: React.WheelEvent, showPanel: boolean) => {
    e.preventDefault();
    e.stopPropagation();

    if (showPanel && !(e.target as HTMLElement).closest('[data-rotation-area]')) {
      const delta = e.deltaY > 0 ? -0.05 : 0.05;
      const newScale = Math.max(0.3, Math.min(2.0, flower.scale + delta));
      updateFlower(flower.id, { scale: newScale });
      return;
    }

    const elements = document.elementsFromPoint(e.clientX, e.clientY);
    const lowerFlowers = elements.filter(el => 
      el.hasAttribute('data-flower-id') && 
      el.getAttribute('data-flower-id') !== flower.id
    );
    
    if (lowerFlowers.length > 0) {
      const lowerFlower = lowerFlowers[0] as HTMLElement;
      lowerFlower.dispatchEvent(new WheelEvent('wheel', {
        clientX: e.clientX,
        clientY: e.clientY,
        deltaY: e.deltaY,
        bubbles: true
      }));
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const panel = document.querySelector(`[data-flower-panel="${flower.id}"]`);
      const outline = document.querySelector(`[data-outline-id="${flower.id}"]`);
      const canvas = document.querySelector(`[data-flower-id="${flower.id}"]`);
      
      const target = e.target as Node;
      if (
        (panel && !panel.contains(target)) && 
        (!outline || !outline.contains(target)) &&
        (!canvas || !canvas.contains(target))
      ) {
        setShowPanel(false);
      }
    };

    if (showPanel) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showPanel, flower.id]);

  return {
    showPanel,
    setShowPanel,
    handleContextMenu,
    handleWheel
  };
};
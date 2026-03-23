import { useState, useEffect } from "react";
import { FlowerType } from "@/types";

export const useGlobalDrag = (
  updateAllFlowers: (updater: (flower: FlowerType) => Partial<FlowerType>) => void
) => {
  const [isMiddleButtonDown, setIsMiddleButtonDown] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // движение всех цветов зажатием колесика мыши
  // РЕЛИЗ 1 - ТЕПЕРЬ ПКМ
  const handleMouseDown = (event: MouseEvent) => {
    if (event.button === 1 || event.button === 2) {
      setIsMiddleButtonDown(true);
      setDragOffset({ x: event.clientX, y: event.clientY });
      event.preventDefault();
    }
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (isMiddleButtonDown) {
      const deltaX = event.clientX - dragOffset.x;
      const deltaY = event.clientY - dragOffset.y;
      updateAllFlowers(flower => ({
        x: flower.x + deltaX,
        y: flower.y + deltaY
      }));
      setDragOffset({ x: event.clientX, y: event.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsMiddleButtonDown(false);
  };

  const handleContextMenu = (event: MouseEvent) => {
    event.preventDefault();
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isMiddleButtonDown, dragOffset]);

  return {
    isMiddleButtonDown,
    dragHandlers: {
      onMouseDown: (event: React.MouseEvent) => handleMouseDown(event.nativeEvent),
      onWheel: (event: React.WheelEvent) => event.preventDefault()
    }
  };
};
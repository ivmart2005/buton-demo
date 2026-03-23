import { useState, useEffect } from "react";
import { FlowerType } from "@/types";

export const useFlowerInteractions = (
  flower: FlowerType,
  allFlowers: FlowerType[],
  updateFlower: (id: string, updates: Partial<FlowerType>) => void,
  isGlobalDrag: boolean,
  isRotating: boolean
) => {
  const [showPanel, setShowPanel] = useState(false);

  const handleContextMenu = (event: React.MouseEvent) => {
    if (isGlobalDrag || isRotating)
      return;
    event.preventDefault();
    for (let i = allFlowers.length - 1; i >= 0; i--) {
      const currentFlower = allFlowers[i];
      const currentCanvas = document.querySelector(`[data-flower-id="${currentFlower.id}"]`) as HTMLCanvasElement;
      if (!currentCanvas)
        continue;
      const rect = currentCanvas.getBoundingClientRect();
      const context = currentCanvas.getContext("2d", { willReadFrequently: true });
      if (!context)
        continue;
      // рассчёт абсолютных координат клика
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      // поиск цветка под мышью сверху вниз
      if (x >= 0 && y >= 0 && x < rect.width && y < rect.height) {
        // проверка прозрачности (можно перетаскивать только за полупрозрачный/непрозрачный кусок картинки)
        const pixel = context.getImageData(x, y, 1, 1).data;
        if (pixel[3] > 10) {
          if (currentFlower.id === flower.id) {
            setShowPanel(true); // панель редактирования станвоится доступной
          } else {
            currentCanvas.dispatchEvent(new MouseEvent("contextmenu", {
              clientX: event.clientX,
              clientY: event.clientY,
              bubbles: true
            }));
          }
          event.stopPropagation();
          return;
        }
      }
    }

    setShowPanel(false);
  };

  // зум при открытой панели редактирования наводкой на цветок
  const handleWheel = (event: React.WheelEvent, showPanel: boolean) => {
    event.preventDefault();
    event.stopPropagation();
    // обновление размеров
    if (showPanel && !(event.target as HTMLElement).closest("[data-rotation-area]")) {
      const delta = event.deltaY > 0 ? -0.05 : 0.05; // от себя - увеличение. на себя - уменьшение
      const newScale = Math.max(0.3, Math.min(3.0, flower.scale + delta));
      updateFlower(flower.id, { scale: newScale });
      return;
    }
    // обработка нижних цветов
    const elements = document.elementsFromPoint(event.clientX, event.clientY);
    const lowerFlowers = elements.filter(element =>
      element.hasAttribute("data-flower-id") &&
      element.getAttribute("data-flower-id") !== flower.id
    );
    if (lowerFlowers.length > 0) {
      const lowerFlower = lowerFlowers[0] as HTMLElement;
      lowerFlower.dispatchEvent(new WheelEvent("wheel", {
        clientX: event.clientX,
        clientY: event.clientY,
        deltaY: event.deltaY,
        bubbles: true
      }));
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const panel = document.querySelector(`[data-flower-panel="${flower.id}"]`);
      const outline = document.querySelector(`[data-outline-id="${flower.id}"]`);
      const canvas = document.querySelector(`[data-flower-id="${flower.id}"]`);
      const target = event.target as Node;
      if (
        (panel && !panel.contains(target)) && // если клик по панели
        (!outline || !outline.contains(target)) && // если клик не по границе
        (!canvas || !canvas.contains(target)) // если клик не по холсту
      ) {
        setShowPanel(false); // не показывать панель редактирования
      }
    };
    if (showPanel) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPanel, flower.id]);

  return {
    showPanel,
    setShowPanel,
    handleContextMenu,
    handleWheel
  };
};
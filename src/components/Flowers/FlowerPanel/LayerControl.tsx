import { useFlowersContext } from "@/contexts/FlowersContext";
import "./LayerControl.css";
import { useState, useRef } from "react";

interface LayerControlProps {
  currentFlowerId: string;
}

// вертикальный список из слоев-плиток слева от панели редактирования
// currentFlowerId - выбранный цветок, отображается цветом, отличным от серого
export const LayerControl = ({ currentFlowerId }: LayerControlProps) => {
  const { flowers, setFlowers } = useFlowersContext();
  const [isHovered, setIsHovered] = useState(false); // для вывода подсказки о работе слоёв
  // обработка прокрутки колёсика
  // колёсиком меняется слой выбранного цветка
  const lastUpdate = useRef(0);

  const handleWheel = (event: React.WheelEvent) => {
    event.stopPropagation(); // событие мыши не пойдет на элемент ниже
    if (Math.abs(event.deltaY) < 3) // игноририрование "шума" на тачпаде
      return;
    const timenow = Date.now();
    const isMouse = Math.abs(event.deltaY) >= 70;
    const delay = isMouse ? 30 : 70;
    if (timenow - lastUpdate.current < delay)
      return;
    lastUpdate.current = timenow;
    const currentIndex = flowers.findIndex(flower => flower.id === currentFlowerId);
    if (currentIndex === -1)
      return;
    const deltaWheel = event.deltaY > 0 ? 1 : -1; // отслеживание направления прокрутки мыши
    const newIndex = currentIndex - deltaWheel; // сдвиг на +1 или -1
    if (newIndex >= 0 && newIndex < flowers.length) {
      const newFlowers = [...flowers];
      // смена местами прошлого и нового цветка в копии массива цветов
      [newFlowers[currentIndex], newFlowers[newIndex]] = [newFlowers[newIndex], newFlowers[currentIndex]];
      const updatedFlowers = newFlowers.map((flower, index) => ({
        ...flower,
        zIndex: index
      }));
      setFlowers(updatedFlowers);
    }
  };
  const sortedFlowers = [...flowers].sort((a, b) => b.zIndex - a.zIndex);

  return (
    <div
      className="layer-control"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onWheel={handleWheel}
      title={isHovered ? "Колесом мыши можно менять порядок слоёв" : ""} // !! настроить стиль
    >
      {sortedFlowers.map((flower) => (
        <div
          key={flower.id}
          className={`layer-tile ${flower.id === currentFlowerId ? "current" : ""}`}
        />
      ))}
    </div>
  );
};
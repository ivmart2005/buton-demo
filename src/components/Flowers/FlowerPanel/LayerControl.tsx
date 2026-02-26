import { useFlowersContext } from '@/contexts/FlowersContext';
import './LayerControl.css';
import { useState } from 'react';

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
  const handleWheel = (event: React.WheelEvent) => {
    event.preventDefault(); // против автоматической прокрутки страницы (неактуально)
    event.stopPropagation(); // событие мыши не пойдет на элемент ниже
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
          className={`layer-tile ${flower.id === currentFlowerId ? 'current' : ''}`}
        />
      ))}
    </div>
  );
};
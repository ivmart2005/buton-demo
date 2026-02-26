import { useFlowersContext } from '@/contexts/FlowersContext';
import { useState } from 'react';
import { LayerButton } from './LayerButton';
import './LayersPanel.css';

export const LayersPanel = () => {
  const { flowers, setFlowers } = useFlowersContext();
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [dragOverItemId, setDragOverItemId] = useState<string | null>(null);
  
  // сортировка идёт по индексу, она определяет позицию в вертикальной панели слоёв
  const sortedFlowers = [...flowers].sort((a, b) => b.zIndex - a.zIndex);

  // функции соединяют кнопки (LayerButton) с панелью слоёв

  // Удаление цветка по ID
  const handleDelete = (flowerId: string) => {
    setFlowers(flowers.filter(f => f.id !== flowerId));
  };
  
                                       // возврат функции, которая принимает event
  const handleDragStart = (flowerId: string) => (event: React.DragEvent) => {
    // при вызове handleDragStart("... + str-айди") создастся анонимная функция (без названия) с телом ниже:
    setDraggedItemId(flowerId);
    event.dataTransfer.setData('flowerId', flowerId);
    event.dataTransfer.effectAllowed = 'move';
  };

  // !!! "OVER" - передаскивание НАД другой кнопкой другой кнопки, не конец перетаскивания ("it's over")
  const handleDragOver = (flowerId: string) => (event: React.DragEvent) => {
    event.preventDefault();
    if (flowerId !== draggedItemId) {
      setDragOverItemId(flowerId);
    }
  };

  // "Leave" - значит перетаскиваемый 
  const handleDragLeave = () => {
    setDragOverItemId(null);
  };

  // уже финальное отпускание кнопки после drag-а
  //                   кнопка, на которую бросили
  const handleDrop = (targetFlowerId: string) => (event: React.DragEvent) => {
    event.preventDefault();
    // не было перетаскивания или перетащили на то же место - завершаем
    if (!draggedItemId || draggedItemId === targetFlowerId) {
      setDraggedItemId(null);
      setDragOverItemId(null);
      return;
    }
    const draggedIndex = flowers.findIndex(f => f.id === draggedItemId);
    const targetIndex = flowers.findIndex(f => f.id === targetFlowerId);
    if (draggedIndex === -1 || targetIndex === -1) return;
    // смена кнопок местами
    const newFlowers = [...flowers];
    const [draggedFlower] = newFlowers.splice(draggedIndex, 1);
    newFlowers.splice(targetIndex, 0, draggedFlower);

    const updatedFlowers = newFlowers.map((flower, index) => ({
      ...flower,
      zIndex: index
    }));
    // обновление
    setFlowers(updatedFlowers);
    setDraggedItemId(null);
    setDragOverItemId(null);
  };

  // сброс в любом случае
  const handleDragEnd = () => {
    setDraggedItemId(null);
    setDragOverItemId(null);
  };

  return (
    <div className="layers-panel">
      <div className="layers-list">
        {sortedFlowers.map((flower, index) => (
          <LayerButton
            key={flower.id}
            flower={flower}
            index={index}
            isDragging={draggedItemId === flower.id}
            isDragOver={dragOverItemId === flower.id}
            onDragStart={handleDragStart(flower.id)}
            onDragOver={handleDragOver(flower.id)}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop(flower.id)}
            onDragEnd={handleDragEnd}
            onDelete={() => handleDelete(flower.id)}
          />
        ))}
        
        {sortedFlowers.length === 0 && (
          <div className="empty-state">
            Холст пуст
          </div>
        )}
      </div>
    </div>
  );
};
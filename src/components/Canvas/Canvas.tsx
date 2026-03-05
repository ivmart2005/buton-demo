import { useState, useRef, useEffect } from 'react';
import { Flower } from '@/components/Flowers/Flower';
import { useGlobalDrag } from '@/hooks/useGlobalDrag';
import { Catalog } from '@/components/Catalog/Catalog';
import { useFlowersContext } from '@/contexts/FlowersContext';
import { LayersPanel } from '@/components/LayersPanel/LayersPanel';

import { BouquetControls } from '@/components/BouquetControls';

import './Canvas.css';

export function Canvas() {
  // !!! контекст для синхронизации букета между всеми модулями программы
  const { flowers, updateAllFlowers, updateFlower } = useFlowersContext();
  // дебаг сообщения в консоль для отладки
  const [debugInfo, setDebugInfo] = useState('');
  // перетаскивание одновременно всех цветов зажатым колесиком мыши
  const { isMiddleButtonDown, dragHandlers } = useGlobalDrag(updateAllFlowers);
  // управление открытием и закрытием каталога
  const catalogRef = useRef<{ open: () => void }>(null);
  // двойной клик открывает каталог цветов
  const handleDoubleClick = (event: React.MouseEvent) => {
    if (catalogRef.current) {
      catalogRef.current.open();
    }
  };

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();

        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const factor = e.deltaY > 0 ? 0.95 : 1.05;

        updateAllFlowers((flower) => {
          const dx = flower.x - centerX;
          const dy = flower.y - centerY;

          return {
            x: centerX + dx * factor,
            y: centerY + dy * factor,
            scale: (flower.scale || 1) * factor
          };
        });
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [updateAllFlowers]);

  return ( // реакт-компонент возвращается в App.tsx
    <div
      className="canvas-root"
      {...dragHandlers}
      onDoubleClick={handleDoubleClick}
    >
      {/* кнопки контроля букетов */}
      {window.electronAPI ? (<BouquetControls/>) : (null)}
      {/* каталог-библиотека с цветами */}
      <Catalog ref={catalogRef} />
      {/* панель слоёв слева */}
      <LayersPanel />
      {/* рендеринг всех цветов на холсте */}
      {flowers.map(flower => (
        <Flower // пропсы во Flower.tsx
          key={flower.id}
          flower={flower}
          allFlowers={flowers}
          setDebugInfo={setDebugInfo}
          updateFlower={updateFlower}
          isGlobalDrag={isMiddleButtonDown}
        />
      ))}
    </div>
  );
}
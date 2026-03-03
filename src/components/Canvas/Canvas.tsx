import { useState, useRef } from 'react';
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
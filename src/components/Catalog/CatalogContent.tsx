import { forwardRef, useState } from 'react';
import { FilterPanel } from './FilterPanel/FilterPanel';
import { FlowersList } from './FlowersList/FlowersList';
import { FlowerTypesWindow } from './FilterPanel/FlowerTypesFilter/FlowerTypesWindow/FlowerTypesWindow';
import { useFlowerTypes } from '@/hooks/useFlowerTypes';
import './Catalog.css';

interface CatalogContentProps {
  isOpen: boolean;
  onOpenTypesWindow?: () => void;
  onCloseTypesWindow?: () => void;
  isTypesWindowOpen?: boolean;
}

const CatalogContent = forwardRef<HTMLDivElement, CatalogContentProps>(
  ({ isOpen, onOpenTypesWindow, onCloseTypesWindow, isTypesWindowOpen }, ref) => {
    const [selectedColors, setSelectedColors] = useState<number[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTypes, setSelectedTypes] = useState<number[]>([]); 
    const [localTypesWindowOpen, setLocalTypesWindowOpen] = useState(false);
    
    const { flowerTypes } = useFlowerTypes();

    const typesWindowOpen = isTypesWindowOpen !== undefined 
      ? isTypesWindowOpen 
      : localTypesWindowOpen;

    const handleTypeSelect = (types: number[]) => { 
      setSelectedTypes(types);
      if (onCloseTypesWindow) {
        onCloseTypesWindow();
      } else {
        setLocalTypesWindowOpen(false);
      }
    };

    const handleOpenTypesWindow = () => {
      if (onOpenTypesWindow) {
        onOpenTypesWindow();
      } else {
        setLocalTypesWindowOpen(true);
      }
    };

    const handleResetTypes = () => {
      setSelectedTypes([]);
    };

    return (
      <>
        <div
          ref={ref}
          className={`catalog-container ${isOpen ? 'open' : ''}`}
        >
          {/* панель фильтров слева */}
          <div className="catalog-inner">
            <FilterPanel
              onColorSelectionChange={setSelectedColors} 
              onSearch={setSearchQuery}
              onOpenTypesWindow={handleOpenTypesWindow}
              isAnyTypeSelected={selectedTypes.length > 0}
              onResetTypes={handleResetTypes}
            />
            {/* список цветов справа */}
            <div className="flowers-list-wrapper">
              <FlowersList
                selectedColors={selectedColors} 
                searchQuery={searchQuery}
                selectedTypes={selectedTypes} 
              />
            </div>
          </div>
        </div>
        {/* окно типов, появлсяется при клике по кнпоке */}
        <FlowerTypesWindow
          isOpen={typesWindowOpen}
          onClose={() => {
            if (onCloseTypesWindow) {
              onCloseTypesWindow();
            } else {
              setLocalTypesWindowOpen(false);
            }
          }}
          onTypeSelect={handleTypeSelect} 
        />
      </>
    );
  }
);

export { CatalogContent };
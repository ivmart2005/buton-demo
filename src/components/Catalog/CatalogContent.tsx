import { forwardRef, useState } from 'react';
import { FilterPanel } from './FilterPanel/FilterPanel';
import { FlowersList } from './FlowersList/FlowersList';
import { FlowerTypesWindow } from './FilterPanel/FlowerTypesFilter/FlowerTypesWindow/FlowerTypesWindow';
import './Catalog.css';

interface CatalogContentProps {
  isOpen: boolean;
  onOpenTypesWindow: () => void;
  onCloseTypesWindow: () => void;
  isTypesWindowOpen: boolean;
}

const CatalogContent = forwardRef<HTMLDivElement, CatalogContentProps>(
  ({ isOpen, onOpenTypesWindow, onCloseTypesWindow, isTypesWindowOpen }, ref) => {
    const [selectedColors, setSelectedColors] = useState<number[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTypes, setSelectedTypes] = useState<number[]>([]);
    const [localTypesWindowOpen, setLocalTypesWindowOpen] = useState(false);
    const typesWindowOpen = isTypesWindowOpen ?? localTypesWindowOpen;

    const handleTypeSelect = (types: number[]) => {
      setSelectedTypes(types);
      onCloseTypesWindow();
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
              isOpen={isOpen}
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
          onClose={onCloseTypesWindow}
          onTypeSelect={handleTypeSelect}
        />
      </>
    );
  }
);

export {CatalogContent};
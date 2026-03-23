import { useState, useEffect, useRef } from 'react';
import { SearchInput } from './SearchInput';
import { ColorWheel } from './ColorWheel';
import { ColorWheelControls } from './ColorWheelControls';
import { ColorSegment } from './types';
import { FlowerTypesFilterButton } from './FlowerTypesFilter';
import './FilterPanel.css';

interface FilterPanelProps {
  isOpen: boolean;
  width?: number;
  onColorSelectionChange?: (selectedColors: number[]) => void;
  onSearch?: (query: string) => void;
  onOpenTypesWindow?: () => void;
  isAnyTypeSelected?: boolean;
  onResetTypes?: () => void;
}

export const FilterPanel = ({
  isOpen,
  width = 300,
  onColorSelectionChange = () => {},
  onSearch = () => {},
  onOpenTypesWindow = () => {},
  isAnyTypeSelected = false,
  onResetTypes = () => {}
}: FilterPanelProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  // цвета взяты из круга Иттена, не убирать в БД
  const [segments, setSegments] = useState<ColorSegment[]>([
    {colorName: "жёлтый", colorRgb: "F4E500", colorId: 1, xMult: 0.5, yMult: 0.0822, checked: true},
    {colorName: "жёлто-оранжевый", colorRgb: "FDC60B", colorId: 2, xMult: 0.7047, yMult: 0.143, checked: true},
    {colorName: "оранжевый", colorRgb: "F18E1C", colorId: 3, xMult: 0.852, yMult: 0.288, checked: true},
    {colorName: "оранжево-красный", colorRgb: "EA621F", colorId: 4, xMult: 0.906, yMult: 0.5, checked: true},
    {colorName: "красный", colorRgb: "E32322", colorId: 5, xMult: 0.846, yMult: 0.693, checked: true},
    {colorName: "фиолетово-красный", colorRgb: "C4037D", colorId: 6, xMult: 0.711, yMult: 0.839, checked: true},
    {colorName: "фиолетовый", colorRgb: "6D398B", colorId: 7, xMult: 0.5, yMult: 0.887, checked: true},
    {colorName: "сине-фиолетовый", colorRgb: "444E99", colorId: 8, xMult: 0.3, yMult: 0.837, checked: true},
    {colorName: "синий", colorRgb: "2A71B0", colorId: 9, xMult: 0.157, yMult: 0.69, checked: true},
    {colorName: "синий", colorRgb: "0696BB", colorId: 10, xMult: 0.097, yMult: 0.5, checked: true},
    {colorName: "тёмно-зелёный", colorRgb: "008E5B", colorId: 11, xMult: 0.153, yMult: 0.285, checked: true},
    {colorName: "светло-зелёный", colorRgb: "8CBB26", colorId: 12, xMult: 0.304, yMult: 0.142, checked: true}
  ]);
  const isElectron = !!window?.electronAPI;

  useEffect(() => {
    const selectedColors = segments
      .filter(segment => segment.checked)
      .map(segment => segment.colorId);
    onColorSelectionChange(selectedColors);
  }, [segments]);

  const toggleSegment = (colorId: number) => {
    setSegments(segments.map(segment => segment.colorId === colorId
        ? {...segment, checked: !segment.checked}
        : segment
    ));
    inputRef.current?.focus();
  };

  const selectAll = () => {
    setSegments(segments.map(s => ({...s, checked: true})));
  };

  const deselectAll = () => {
    setSegments(segments.map(s => ({...s, checked: false})));
  };

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 300); // анимация выплывания каталога
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <div className="filter-panel" style={{ width }}>
      <div className="filter-panel-header">
        <h2>Каталог</h2>
      </div>

      <div className="filter-panel-content">
        {/* поисковая строка */}
        <SearchInput onSearch={onSearch} inputRef={inputRef} />
        <ColorWheel
          segments={segments}
          onSegmentToggle={toggleSegment}
          size={330}
        />
        {/* 2 кнопки фильтров под цветом под кругом Иттена */}
        <ColorWheelControls
          onSelectAll={selectAll}
          onDeselectAll={deselectAll}
        />
        {/* кнопка открытия фильтров */}
        {isElectron && (
          <div className="types-filter-container">
            <FlowerTypesFilterButton
              onClick={onOpenTypesWindow}
              isShrunk={isAnyTypeSelected}
            />
            {isAnyTypeSelected && (
              <button
                className="btn-reset-types-quick"
                onClick={onResetTypes}
              >
                Сбросить
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
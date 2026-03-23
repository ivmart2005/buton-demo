import { FlowerType } from '@/types/flower_types';
import { useFlowerTypes } from '@/hooks/useFlowerTypes';
import { FlowerTypeButton } from './FlowerTypeButton';
import { useState } from 'react';
import './FlowerTypesWindow.css';

interface FlowerTypesWindowProps {
  isOpen: boolean;
  onClose: () => void; // ожидается функция, возвращающая void
  onTypeSelect: (types: number[]) => void;
}

export const FlowerTypesWindow = ({isOpen, onClose, onTypeSelect}: FlowerTypesWindowProps) => {
  const {flowerTypes} = useFlowerTypes();
  const [selectedTypes, setSelectedTypes] = useState<number[]>([]);
  
  if (!isOpen)
    return null;

  const handleConfirm = () => {
    onTypeSelect(selectedTypes);
  };

  const handleTypeSelect = (type: FlowerType) => {
    if (selectedTypes.includes(type.id)) {
      setSelectedTypes(selectedTypes.filter(id => id !== type.id));
    } else {
      setSelectedTypes([...selectedTypes, type.id]);
    }
  };

  const handleClearSelection = () => {
    setSelectedTypes([]);
  };

  return (
    <div className="flower-types-modal-overlay" onClick={onClose}>
      <div className="flower-types-modal" onClick={event => event.stopPropagation()}>
        <div className="flower-types-header">
          <div className="flower-types-header-left">
            <h3 className="flower-types-title">
              Виды цветов
            </h3>
          </div>
          <div className="flower-types-header-right">
            <button
              className="flower-types-clear-button"
              onClick={handleClearSelection}
              disabled={selectedTypes.length === 0}
            >
              Сбросить
            </button>
            <button
              className="flower-types-apply-button"
              onClick={handleConfirm}
            >
              Применить
            </button>
          </div>
        </div>
        
        <div className="flower-types-grid-container">
          <div className="flower-types-grid">
            {flowerTypes.map(type => (
              <FlowerTypeButton
                key={type.id}
                type={type}
                isSelected={selectedTypes.includes(type.id)}
                onClick={() => handleTypeSelect(type)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
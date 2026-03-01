interface FlowerTypesFilterButtonProps {
  onClick: () => void;
  isShrunk?: boolean; // если isShrunk === true,
  // в FilterPanel.tsx справа от кнопки "Фильтрация по фильтрам" рисуется кнопка "Сбросить"
}

export const FlowerTypesFilterButton = ({ onClick, isShrunk }: FlowerTypesFilterButtonProps) => {
  const isElectron = Boolean((window as any).electronAPI);
  
  //if (!isElectron) {
  //  return null;
  //}

  return (
    <button
      className={`flower-types-filter-btn ${isShrunk ? 'is-shrunk' : ''}`} 
      onClick={onClick}
    >
      Фильтрация по типам
    </button>
  );
};
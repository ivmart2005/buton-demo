import './Catalog.css';

interface CatalogButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export const CatalogButton = ({ isOpen, onClick }: CatalogButtonProps) => (
  <button 
    className={`catalog-button`}
    onClick={onClick}
  >
    <img 
      src="./images/interface/black-cross.svg" 
      alt="Кнопка открытия каталога" 
      className={`catalog-button-icon ${isOpen ? 'close-sign' : 'plus-sign'}`}
    />
  </button>
);
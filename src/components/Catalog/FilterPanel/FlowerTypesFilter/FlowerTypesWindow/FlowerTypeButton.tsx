import './FlowerTypeButton.css';

interface FlowerTypeButtonProps {
  type: {
    id: number;
    name: string;
    picture: string;
  };
  isSelected: boolean;
  onClick: () => void; // ожидается функция, возвращающая void
}

export const FlowerTypeButton = ({ type, isSelected, onClick }: FlowerTypeButtonProps) => {
  return (
    <button 
      className={`flower-type-button ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <img 
        src={type.picture} 
        alt={type.name}
        className="flower-type-button-image"
      />
      <span className="flower-type-button-name">
        {type.name}
      </span>
    </button>
  );
};
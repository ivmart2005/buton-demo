import './DeleteButton.css';

interface DeleteButtonProps {
  height: number;
  onDelete: () => void;
}

export const DeleteButton = ({ height, onDelete }: DeleteButtonProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <button
      className="delete-button"
      onClick={handleClick}
      style={{ height: `${height / 2 - 20}px` }}
    >
      ×
    </button>
  );
};
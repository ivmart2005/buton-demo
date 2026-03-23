import "./FlowerButton.css"
import { useFlowersContext } from "@/contexts/FlowersContext";

interface FlowerButtonProps {
  id: string;
  title: string;
  x: number;
  y: number;
  colorId: number;
  flower_type_id: number;
  onClick: () => void;
}

// кнопка в каталоге
export const FlowerButton = ({id, title, x, y, colorId, flower_type_id, onClick}: FlowerButtonProps) => {
  const {loadFlower} = useFlowersContext();
  const handleClick = () => {
    loadFlower(title, flower_type_id);
    onClick();
  };

  return (
    <div className="flower-button-container" data-color-id={colorId}>
      <button
        className="flower-button"
        id={id}
        onClick={handleClick}
      >
        <div
          className="flower-image"
          style={{
            backgroundImage: "url(./images/catalogue_preview.png)",
            backgroundPosition: `-${x}px -${y}px`,
            width: "100px",
            height: "100px",
            backgroundRepeat: "no-repeat"
          }}
        />
      </button>
      <div className="flower-title">{title}</div>
    </div>
  );
};
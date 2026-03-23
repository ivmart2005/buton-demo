import { FlowerType } from "@/types";
import { useEffect } from "react";
import "./LayerButton.css";

interface LayerButtonProps {
  flower: FlowerType;
  index: number;
  isDragging: boolean;
  isDragOver: boolean;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onDragEnd: () => void;
  onDelete: () => void;
}

const PREVIEW_SIZE = 30; //                                         пиксели, исправить                     !!!

export const LayerButton = ({
  flower,
  index,
  isDragging,
  isDragOver,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
  onDelete
}: LayerButtonProps) => {

useEffect(() => { // рисование иконки цветка на кнопке перетаскивания
  if (!flower.image) return;
  const canvas = document.querySelector(`[data-layer-preview="${flower.id}"]`) as HTMLCanvasElement;
  if (!canvas) return; // проверка на удаление цветка с холста

  const context = canvas.getContext("2d");
  if (!context) return;
  context.clearRect(0, 0, PREVIEW_SIZE, PREVIEW_SIZE);
  context.drawImage(
    flower.image,
    flower.currentAngle * flower.angles.width, // вырезка по Х из общего 16хх*400px спрайта
    0, // вырезка по У из общего 16хх*400px спрайта
    flower.angles.width, //  размер вырезки (400) на спрайте
    flower.angles.height, // размер вырезки (400) на спрайте
    0, // destination на холсте
    0, // destination на холсте
    PREVIEW_SIZE, // размер конечной картинки
    PREVIEW_SIZE // размер конечной картинки
  );
}, [flower.image, flower.currentAngle, flower.angles.width, flower.angles.height, flower.id]);

  return (
    <div
      className={`
        layer-button
        ${isDragging ? "dragging" : ""}
        ${isDragOver ? "drag-over" : ""}
      `}
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
    >
      <div className="layer-number">
      </div>
      <div className="layer-preview">
        {flower.image && (
          <canvas
            className="layer-canvas"
            data-layer-preview={flower.id}
            width={PREVIEW_SIZE}
            height={PREVIEW_SIZE}
          />
        )}
      </div>
      <div className="layer-info">
        <div className="layer-name">{flower.name}</div>
      </div>
      <button
        className="delete-layer-btn"
        onClick={(event) => {
          event.stopPropagation(); // предотвращаем выделение слоя
          onDelete();
        }}
        onMouseDown={(event) => event.stopPropagation()} // предотвращаем начало драга при клике на иконку
        title="Удалить цветок"
      >
        <img src="./images/interface/rubish-bin-gray.svg" alt="Delete" />
      </button>
    </div>
  );
};
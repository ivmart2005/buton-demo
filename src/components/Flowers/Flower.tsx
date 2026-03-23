import { useFlowersContext } from "@/contexts/FlowersContext";
import { FlowerType } from "@/types";
import { FlowerPanel } from "./FlowerPanel/FlowerPanel";
import { OutlineEdit } from "./FlowerPanel/OutlineEdit";
import { useFlowerDrag } from "./hooks/useFlowerDrag";
import { useFlowerRotation } from "./hooks/useFlowerRotation";
import { useFlowerInteractions } from "./hooks/useFlowerInteractions";
import { useFlowerRender } from "./hooks/useFlowerRender";
import { useFlowerMirror } from "./hooks/useFlowerMirror";
import { useFlowerDuplicate } from "./hooks/useFlowerDuplicate";
import { useFlowerReset } from "./hooks/useFlowerReset";
import { useRef } from "react";

interface FlowerProps { // пропсы для контроля переданных переменных из Canvas
  flower: FlowerType; // key из Canvas не передавать
  allFlowers: FlowerType[];
  updateFlower: (id: string, updates: Partial<FlowerType>) => void;
  isGlobalDrag: boolean;
}

export function Flower({ flower, allFlowers, updateFlower, isGlobalDrag }: FlowerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // кастомные хуки для функционала кнопок
  // для панели редактирования
  const { removeFlower } = useFlowersContext();
  const { mirrorFlower } = useFlowerMirror();
  const { duplicateFlower } = useFlowerDuplicate();
  const { resetFlower } = useFlowerReset();

  // вращение цветка
  const { isRotating, handleRotationStart } = useFlowerRotation(
    flower,
    updateFlower,
    isGlobalDrag,
    canvasRef
  );
  // перетаскивание
  const { isDragging, handleMouseDown } = useFlowerDrag(
    flower,
    updateFlower,
    isGlobalDrag,
    isRotating,
    canvasRef
  );
  // определение хитбоксов цветка
  const {
    showPanel,
    setShowPanel,
    handleContextMenu,
    handleWheel
  } = useFlowerInteractions(
    flower,
    allFlowers,
    updateFlower,
    isGlobalDrag,
    isRotating
  );

  useFlowerRender(flower, canvasRef);

  const flowerWidth = flower.angles.width * flower.scale;
  const panelWidth = 280;
  const panelHeight = 250;
  const offset = 40;
  const isOverflowRight = (flower.x + flowerWidth + offset + panelWidth) > window.innerWidth;
  const isOverflowBottom = (flower.y + panelHeight) > window.innerHeight;
  const finalLeft = isOverflowRight
    ? flower.x - panelWidth - 80
    : flower.x + flowerWidth + 40;
  const finalTop = isOverflowBottom
    ? window.innerHeight - panelHeight
    : flower.y;

  // функции-обработчики кнопок для конкретного цветка
  const handleMirror = () => mirrorFlower(flower.id);
  const handleDuplicate = () => duplicateFlower(flower.id);
  const handleReset = () => resetFlower(flower.id);
  const handleDelete = () => {
    removeFlower(flower.id);
    setShowPanel(false);
  };


  return (
    <>
      {/* контейнер цветка */}
      <div
        className="flower-container"
        style={{
          position: "absolute",
          left: flower.x,
          top: flower.y,
          zIndex: flower.zIndex,
          width: flower.angles.width * flower.scale,
          height: flower.angles.height * flower.scale,
          pointerEvents: isGlobalDrag ? "none" : "auto",
          display: "flex",
          margin: 0,
          padding: 0,
          transformOrigin: "center center"
        }}
      >
        <canvas
          ref={canvasRef}
          data-flower-id={flower.id}
          width={flower.angles.width * flower.scale}
          height={flower.angles.height * flower.scale}
          onMouseDown={(event) => handleMouseDown(event, allFlowers)}
          onContextMenu={handleContextMenu}
          onWheel={(event) => handleWheel(event, showPanel)}
          style={{
            display: "block",
            pointerEvents: "auto",
          }}
        />
      </div>

      {/* контур редактирования */}
      <OutlineEdit
        flower={flower}
        isActive={showPanel}
        onRotationStart={handleRotationStart}
        isRotating={isRotating}
      />

      {/* панель управления (редактирования) */}
      {showPanel && (
        <FlowerPanel
          width={0}
          height={0}
          visible={showPanel}
          flowerId={flower.id}
          onAngleChange={(angle) => updateFlower(flower.id, { currentAngle: angle })}
          onRotationChange={(rotation) => updateFlower(flower.id, { rotation })}
          onSaturationChange={(saturation) => updateFlower(flower.id, { saturation } as any)}
          onDelete={handleDelete}
          onMirror={handleMirror}
          onDuplicate={handleDuplicate}
          onReset={handleReset}
          currentScale={flower.scale}
          currentRotation={flower.rotation}
          currentSaturation={(flower as any).saturation}
          style={{
            position: "absolute",
            left: finalLeft,
            top: finalTop
          }}
        />
      )}
    </>
  );
}
import { useState, useRef } from "react";
import { ColorSegment } from "./types";
import "./ColorWheel.css";

type ColorWheelProps = {
  segments: ColorSegment[];
  onSegmentToggle: (colorId: number) => void; // ожидается функция принимающая число
  size: number;
};

export const ColorWheel = ({ segments, onSegmentToggle, size }: ColorWheelProps) => {
  const [currentColor, setCurrentColor] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!canvasRef.current || !imageRef.current || !containerRef.current)
      return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const radius = size / 2;
    const center_X = radius;
    const center_Y = radius;
    const distance = Math.sqrt(Math.pow(x - center_X, 2) + Math.pow(y - center_Y, 2));
    if (distance <= radius) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        context.drawImage(imageRef.current, 0, 0, size, size);
        const pixel = context.getImageData(x, y, 1, 1).data;
        const hex_color = rgbToHex(pixel[0], pixel[1], pixel[2]);
        setCurrentColor(hex_color);
      }
    } else {
      setCurrentColor("");
    }
  };

  const handleClick = (event: React.MouseEvent) => {
    if (!canvasRef.current || !imageRef.current || !currentColor)
      return;
    const segment = segments.find(s => {
      const segment_hex = s.colorRgb.startsWith("#") ? s.colorRgb : `#${s.colorRgb}`;
      return segment_hex.toLowerCase() === currentColor.toLowerCase();
    });
    if (segment) {
      onSegmentToggle(segment.colorId); // массив segments внутри FilterPanel
    }
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + [r, g, b].map(x => x.toString(16).padStart(2, "0")).join("");
  };

  return (
    <div
      className="color-wheel-container"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      <div className="color-wheel-image-container">
        <canvas
          ref={canvasRef}
          width={size}
          height={size}
          style={{display: "none"}}
        />
        <img
          ref={imageRef}
          src="./images/interface/itten-wheel.png"
          alt="ЦКруг Иттена"
          className="color-wheel-image"
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            cursor: "pointer"
          }}
        />

        {segments.map(segment => (
          <div key={segment.colorId}>
            {/* кольцо для всех невыбранных сегментов */}
            <div
              className="segment-ring"
              style={{
                left: segment.xMult * size,
                top: segment.yMult * size,
              }}
            />

            {/* внутренний круг только для выбранных */}
            <div
              className={`segment-inner-circle ${segment.checked ? "checked" : ""}`}
              style={{
                left: segment.xMult * size,
                top: segment.yMult * size,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
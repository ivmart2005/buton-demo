import { useState, useRef } from 'react';
import './ColorWheel.css';
import { ColorSegment } from './types';

type ColorWheelProps = {
  segments: ColorSegment[];
  onSegmentToggle: (colorId: number) => void;
  size: number;
};

export const ColorWheel = ({ segments, onSegmentToggle, size }: ColorWheelProps) => {
  const [currentColor, setCurrentColor] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current || !imageRef.current || !containerRef.current)
      return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const radius = size / 2;
    const centerX = radius;
    const centerY = radius;
    const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));

    if (distance <= radius) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.drawImage(imageRef.current, 0, 0, size, size);
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        const hex = rgbToHex(pixel[0], pixel[1], pixel[2]);
        setCurrentColor(hex);
      }
    } else {
      setCurrentColor('');
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!canvasRef.current || !imageRef.current || !currentColor)
      return;

    const segment = segments.find(s => {
      const segmentHex = s.colorRgb.startsWith('#') ? s.colorRgb : `#${s.colorRgb}`;
      return segmentHex.toLowerCase() === currentColor.toLowerCase();
    });

    if (segment) {
      onSegmentToggle(segment.colorId); // массив segments внутри FilterPanel
    }
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
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
          style={{ display: 'none' }}
        />
        <img 
          ref={imageRef}
          src="./images/interface/itten-wheel.png"
          alt="Цветовой круг Иттена" 
          className="color-wheel-image"
          style={{ 
            width: size,
            height: size,
            borderRadius: '50%',
            cursor: 'pointer'
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
              className={`segment-inner-circle ${segment.checked ? 'checked' : ''}`}
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
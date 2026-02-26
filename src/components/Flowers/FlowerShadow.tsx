// src/components/Flowers/FlowerShadow.tsx
import { useEffect, useRef } from 'react';
import { FlowerType } from '@/types';

interface FlowerShadowProps {
  flower: FlowerType;
}

export const FlowerShadow = ({ flower }: FlowerShadowProps) => {
  const shadowCanvasRef = useRef<HTMLCanvasElement>(null);
  
  const shadowConfig = {
    color: '#000000',
    offsetX: 8,
    offsetY: 8,
    blur: 12,
    opacity: 0.25
  };

  useEffect(() => {
    if (!flower.image || !shadowCanvasRef.current) return;

    const ctx = shadowCanvasRef.current.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const width = Math.floor(flower.angles.width * flower.scale);
    const height = Math.floor(flower.angles.height * flower.scale);
    
    if (shadowCanvasRef.current.width !== width || shadowCanvasRef.current.height !== height) {
      shadowCanvasRef.current.width = width;
      shadowCanvasRef.current.height = height;
    }
    ctx.clearRect(0, 0, width, height);

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext('2d');
    
    if (tempCtx) {
      tempCtx.save();
      tempCtx.translate(width / 2, height / 2);
      tempCtx.rotate((flower.rotation * Math.PI) / 180);
      
      if ((flower as any).isFlipped) {
        tempCtx.scale(-1, 1);
      }

      try {
        tempCtx.drawImage(
          flower.image,
          flower.currentAngle * flower.angles.width,
          0,
          flower.angles.width,
          flower.angles.height,
          -width / 2,
          -height / 2,
          width,
          height
        );
      } catch (error) {
        console.error('Ошибка рисования тени:', error);
        tempCtx.restore();
        return;
      }

      tempCtx.restore();

      const imageData = tempCtx.getImageData(0, 0, width, height);
      const data = imageData.data;
      const shadowData = new Uint8ClampedArray(data.length);
      
      const shadowRgb = hexToRgb(shadowConfig.color);
      if (!shadowRgb) return;
      
      for (let i = 0; i < data.length; i += 4) {
        const alpha = data[i + 3];
        
        if (alpha > 10) {
          const shadowAlpha = Math.floor(shadowConfig.opacity * alpha);
          
          shadowData[i] = shadowRgb.r;
          shadowData[i + 1] = shadowRgb.g;
          shadowData[i + 2] = shadowRgb.b;
          shadowData[i + 3] = shadowAlpha;
        } else {
          shadowData[i + 3] = 0;
        }
      }

      const blurredData = applyBoxBlur(shadowData, width, height, shadowConfig.blur);
      const buffer = new ArrayBuffer(blurredData.length);
      const fixedData = new Uint8ClampedArray(buffer);
      fixedData.set(blurredData);
      const imageDataForShadow = new ImageData(fixedData, width, height);
      
      ctx.putImageData(
        imageDataForShadow,
        shadowConfig.offsetX,
        shadowConfig.offsetY
      );
    }
  }, [flower]);

  if (!flower.image) return null;

  return (
    <canvas
      ref={shadowCanvasRef}
      style={{
        position: 'absolute',
        left: flower.x,
        top: flower.y,
        zIndex: flower.zIndex - 1,
        pointerEvents: 'none',
      }}
    />
  );
};

const hexToRgb = (hex: string) => {
  hex = hex.replace(/^#/, '');

  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  
  const num = parseInt(hex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
};

const applyBoxBlur = (data: Uint8ClampedArray, width: number, height: number, radius: number): Uint8ClampedArray => {
  if (radius <= 0) return data;
  
  const result = new Uint8ClampedArray(data.length);
  const diameter = radius * 2 + 1;
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0, g = 0, b = 0, a = 0, count = 0;
      
      for (let kx = -radius; kx <= radius; kx++) {
        const nx = x + kx;
        if (nx >= 0 && nx < width) {
          const i = (y * width + nx) * 4;
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          a += data[i + 3];
          count++;
        }
      }
      
      const i = (y * width + x) * 4;
      result[i] = r / count;
      result[i + 1] = g / count;
      result[i + 2] = b / count;
      result[i + 3] = a / count;
    }
  }
  
  const finalResult = new Uint8ClampedArray(data.length);
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let r = 0, g = 0, b = 0, a = 0, count = 0;
      
      for (let ky = -radius; ky <= radius; ky++) {
        const ny = y + ky;
        if (ny >= 0 && ny < height) {
          const i = (ny * width + x) * 4;
          r += result[i];
          g += result[i + 1];
          b += result[i + 2];
          a += result[i + 3];
          count++;
        }
      }
      
      const i = (y * width + x) * 4;
      finalResult[i] = r / count;
      finalResult[i + 1] = g / count;
      finalResult[i + 2] = b / count;
      finalResult[i + 3] = a / count;
    }
  }
  
  return finalResult;
};
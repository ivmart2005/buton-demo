// src/components/Flowers/hooks/useFlowerRender.ts
import { useEffect, RefObject } from 'react';
import { FlowerType } from '@/types';

export const useFlowerRender = (flower: FlowerType, canvasRef: RefObject<HTMLCanvasElement | null>) => {
  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx || !flower.image) return;
    
    const displayWidth = Math.abs(flower.angles.width * flower.scale);
    const displayHeight = Math.abs(flower.angles.height * flower.scale);
    
    const shadowOffset = 10;
    const shadowBlur = 15;
    const totalWidth = displayWidth + shadowOffset + shadowBlur;
    const totalHeight = displayHeight + shadowOffset + shadowBlur;
    
    if (ctx.canvas.width !== totalWidth || ctx.canvas.height !== totalHeight) {
      ctx.canvas.width = totalWidth;
      ctx.canvas.height = totalHeight;
    }

    ctx.clearRect(0, 0, totalWidth, totalHeight);
    ctx.save();
    ctx.translate(shadowOffset + displayWidth / 2, shadowOffset + displayHeight / 2);
    ctx.rotate((flower.rotation * Math.PI) / 180);

    if ((flower as any).isFlipped) {
      ctx.scale(-1, 1);
    }

    ctx.filter = 'blur(10px) brightness(0.4) opacity(0.5)';
    
    ctx.drawImage(
      flower.image,
      flower.currentAngle * flower.angles.width,
      0,
      flower.angles.width,
      flower.angles.height,
      -displayWidth / 2,
      -displayHeight / 2,
      displayWidth,
      displayHeight
    );
    
    ctx.restore();

    ctx.save();
    
    ctx.translate(displayWidth / 2 + shadowBlur / 2, displayHeight / 2 + shadowBlur / 2);
    ctx.rotate((flower.rotation * Math.PI) / 180);

    if ((flower as any).isFlipped) {
      ctx.scale(-1, 1);
    }

    if ((flower as any).saturation !== 1.0) {
      ctx.filter = `saturate(${(flower as any).saturation})`;
    } else {
      ctx.filter = 'none';
    }

    try {
      ctx.drawImage(
        flower.image,
        flower.currentAngle * flower.angles.width,
        0,
        flower.angles.width,
        flower.angles.height,
        -displayWidth / 2,
        -displayHeight / 2,
        displayWidth,
        displayHeight
      );
    } catch (error) {
      console.error('useFlowerRender.ts - ошибка -', error, flower.name);
    }
    
    ctx.restore();
    
  }, [flower.image, flower.currentAngle, flower.scale, flower.rotation, 
      flower.angles, (flower as any).saturation, (flower as any).isFlipped, canvasRef]);
};
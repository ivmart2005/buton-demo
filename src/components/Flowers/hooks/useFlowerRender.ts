import { useEffect, RefObject } from 'react';
import { FlowerType } from '@/types';

export const useFlowerRender = (flower: FlowerType, canvasRef: RefObject<HTMLCanvasElement | null>) => {
  useEffect(() => {
    const context = canvasRef.current?.getContext('2d');
    if (!context || !flower.image)
      return;
    
    const displayWidth = Math.abs(flower.angles.width * flower.scale);
    const displayHeight = Math.abs(flower.angles.height * flower.scale);
    const shadowOffset = 10;
    const shadowBlur = 15;
    const totalWidth = displayWidth + shadowOffset + shadowBlur;
    const totalHeight = displayHeight + shadowOffset + shadowBlur;
    
    if (context.canvas.width !== totalWidth || context.canvas.height !== totalHeight) {
      context.canvas.width = totalWidth;
      context.canvas.height = totalHeight;
    }

    context.clearRect(0, 0, totalWidth, totalHeight);
    context.save();
    context.translate(shadowOffset + displayWidth / 2, shadowOffset + displayHeight / 2);
    context.rotate((flower.rotation * Math.PI) / 180);

    if ((flower as any).isFlipped) {
      context.scale(-1, 1);
    }

    context.filter = 'blur(10px) brightness(0.4) opacity(0.5)';
    // тень под цветком. рисовать стандартную тень слишко мзатратно
    context.drawImage(
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
    
    context.restore();
    context.save();
    context.translate(displayWidth / 2 + shadowBlur / 2, displayHeight / 2 + shadowBlur / 2);
    context.rotate((flower.rotation * Math.PI) / 180);
    if ((flower as any).isFlipped) {
      context.scale(-1, 1);
    }
    if ((flower as any).saturation !== 1.0) {
      context.filter = `saturate(${(flower as any).saturation})`;
    } else {
      context.filter = 'none';
    }
    // цветок над тенью
    try {
      context.drawImage(
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
      console.error('useFlowerRender.ts - ошибка рисования цветка -', error, flower.name);
    }
    context.restore();
    
  }, [flower.image,
    flower.currentAngle,
    flower.scale,
    flower.rotation, 
    flower.angles,
    (flower as any).saturation,
    (flower as any).isFlipped,
    canvasRef]);
};
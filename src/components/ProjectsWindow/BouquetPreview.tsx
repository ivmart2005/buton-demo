import { useEffect, useRef, useState } from 'react';
import { SavedFlower } from '@/types/bouquet';

interface BouquetPreviewProps {
  filePath: string;
  size?: number;
}

type LoadedFlower = {
  img: HTMLImageElement;
  flower: SavedFlower;
};

export const BouquetPreview = ({ filePath, size = 180 }: BouquetPreviewProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [bouquetData, setBouquetData] = useState<{
    flowers: SavedFlower[];
    loadedImages: LoadedFlower[];
  } | null>(null);

  useEffect(() => {
    const loadBouquetData = async () => {
      if (!filePath || !window.electronAPI?.loadBouquetFromPath) {
        setHasError(true);
        setIsLoading(false);
        return;
      }

      try {
        const flowers: SavedFlower[] = await window.electronAPI.loadBouquetFromPath(filePath);
        
        if (!flowers || flowers.length === 0) {
          setHasError(true);
          return;
        }

        const flowerPromises = flowers.map(async (flower): Promise<LoadedFlower | null> => {
          try {
            const base64 = await window.electronAPI.getFlowerImage(flower.flowerName);
            const img = new Image();
            
            await new Promise<void>((resolve, reject) => {
              img.onload = () => resolve();
              img.onerror = reject;
              img.src = base64;
            });
            
            return { img, flower };
          } catch (error) {
            return null;
          }
        });
        
        const loadedFlowersResults = await Promise.all(flowerPromises);
        const loadedImages: LoadedFlower[] = loadedFlowersResults.filter(
          (item): item is LoadedFlower => item !== null
        );
        
        if (loadedImages.length === 0) {
          setHasError(true);
          return;
        }
        
        setBouquetData({ flowers, loadedImages });
        setHasError(false);
      } catch (error) {
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadBouquetData();
  }, [filePath]);

  useEffect(() => {
    if (!bouquetData || !canvasRef.current) return;

    const renderToCanvas = () => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const { loadedImages } = bouquetData;
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);
      
      ctx.fillStyle = 'rgba(255,255,255,0)';
      ctx.fillRect(0, 0, width, height);
      
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      
      loadedImages.forEach(({ img, flower }) => {
        const fScale = flower.scale || 1;
        const fw = (img.width / 4) * fScale;
        const fh = img.height * fScale;
        
        minX = Math.min(minX, flower.x - fw/2);
        maxX = Math.max(maxX, flower.x + fw/2);
        minY = Math.min(minY, flower.y - fh/2);
        maxY = Math.max(maxY, flower.y + fh/2);
      });
      
      const bWidth = maxX - minX;
      const bHeight = maxY - minY;
      
      const padding = 20; 
      const scale = Math.min(
        (width - padding * 2) / bWidth,
        (height - padding * 2) / bHeight
      );
      
      const centerX = (width - bWidth * scale) / 2;
      const centerY = (height - bHeight * scale) / 2;

      loadedImages.sort((a,b) => (a.flower.zIndex || 0) - (b.flower.zIndex || 0)).forEach(({ img, flower }) => {
        ctx.save();
        
        const scaledX = centerX + (flower.x - minX) * scale;
        const scaledY = centerY + (flower.y - minY) * scale;
        
        ctx.translate(scaledX, scaledY);
        ctx.rotate(((flower.rotation || 0) * Math.PI) / 180);
        
        if (flower.isFlipped) ctx.scale(-1, 1);
        
        const fScale = scale * (flower.scale || 1);
        const sw = img.width / 4;
        const sh = img.height;
        const dw = sw * fScale;
        const dh = sh * fScale;
        
        ctx.drawImage(img, (flower.currentAngle || 0) * sw, 0, sw, sh, -dw / 2, -dh / 2, dw, dh);
        ctx.restore();
      });
    };

    renderToCanvas();
  }, [bouquetData, size]);

  if (isLoading || hasError) {
    return <div className="file-preview-placeholder">{hasError ? 'Пустой букет' : ''}</div>;
  }

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={100}
      className="bouquet-canvas-preview"
    />
  );
};
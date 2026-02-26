import { SavedFlower } from '@/types/bouquet';

export const useConvertBouquet = () => {
  const convert = async (savedFlowers: SavedFlower[]): Promise<any[]> => {
    const convertedFlowers = [];
    
    for (const savedFlower of savedFlowers) {
      try {
        let imageSrc: string;
        
        if (window.electronAPI?.getFlowerImage) {
          imageSrc = await window.electronAPI.getFlowerImage(savedFlower.flowerName);
        } else {
          const fileName = `${savedFlower.flowerName.replace(/\s+/g, '-')}.png`;
          imageSrc = `./images/flowers/${fileName}`;
        }
        
        const img = new Image();
        
        await new Promise((resolve, reject) => {
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error(`useConvertBouquet.ts - ошибка загрузки: ${savedFlower.flowerName}`));
          img.src = imageSrc;
        });
        
        const anglesWidth = Math.floor(img.width / 4);
        const flower = {
          id: Math.random().toString(36).slice(2),
          name: savedFlower.flowerName,
          image: img,
          width: img.width,
          height: img.height,
          x: savedFlower.x || 800,
          y: savedFlower.y || 100,
          zIndex: savedFlower.zIndex || 0,
          scale: savedFlower.scale || 0.7,
          rotation: savedFlower.rotation || 0,
          currentAngle: savedFlower.currentAngle || 0,
          saturation: savedFlower.saturation || 1.0,
          isFlipped: savedFlower.isFlipped || false,
          flower_type_id: savedFlower.flower_type_id || 1,
          angles: {
            width: anglesWidth,
            height: img.height
          }
        };
        
        convertedFlowers.push(flower);
      } catch (error) {
      }
    }
    
    return convertedFlowers;
  };

  return { convert };
};
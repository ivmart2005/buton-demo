import { useEffect, useRef } from 'react';

export const useFlowerLoader = (loadFlower: (name: string, imagePath: string) => void, flowerName: string) => {
  const hasLoaded = useRef(false);

  useEffect(() => {
    //console.log("ЗАГРУЗКА ДЕФОЛТНОГО")
    if (flowerName && !hasLoaded.current) {
      hasLoaded.current = true;
      
      const imagePath = `./images/flowers/${flowerName}`;
      
      const img = new Image();
      img.src = imagePath;
      
      img.onload = () => {
        loadFlower(flowerName, imagePath);
      };
      
      img.onerror = () => {
        console.error(`Ошибка загрузки изображения: ${imagePath}`);
      };
    }
  }, [loadFlower, flowerName]);
};
import { useEffect, useState } from 'react';
import { FlowerType } from '@/types/flower_types';

export const useFlowerTypes = () => {
  const [flowerTypes, setFlowerTypes] = useState<FlowerType[]>([]);

  useEffect(() => {
    const loadFlowerTypes = async () => {
      const api = (window as any).electronAPI;
      if (!api || !api.getFlowerTypes) return;

      try {
        const typesList = await api.getFlowerTypes();
        
        const processedTypes = typesList.map((type: any) => {
          let finalImage = './images/flowers/mock-flower-type.png';

          if (type.picture) {
            const bufferData = type.picture.data || type.picture;
            
            if (bufferData && (bufferData.length > 0 || bufferData.byteLength > 0)) {
              const uint8Array = new Uint8Array(bufferData);
              let binary = '';
              const len = uint8Array.byteLength;
              for (let i = 0; i < len; i++) {
                binary += String.fromCharCode(uint8Array[i]);
              }
              
              const base64String = window.btoa(binary);
              finalImage = `data:image/png;base64,${base64String}`;
            }
          }

          return {
            ...type,
            picture: finalImage
          };
        });

        setFlowerTypes(processedTypes);
      } catch (error) {
        console.error("Ошибка обработки типов цветов:", error);
      }
    };

    loadFlowerTypes();
  }, []);

  return { flowerTypes };
};
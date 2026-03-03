import { useState, useEffect } from 'react';
import { FlowerType } from '../types';
import { ProjectItem } from '../types/project';

export const useFlowers = () => {
  const [flowers, setFlowers] = useState<FlowerType[]>([]);
  // уже загруженные цветы кэшируются
  const [flowerCache, setFlowerCache] = useState<Map<string, HTMLImageElement>>(new Map());
  const [isDirty, setIsDirty] = useState(false);
  const [currentProject, setCurrentProject] = useState<ProjectItem | null>(null);

  useEffect(() => {
    // загрузка цветов в кэш
    const loadAllFlowerImages = async () => {
      if (!window.electronAPI)
        return;
      try {
        const flowersFromDB = await window.electronAPI.getFlowers();
        const cache = new Map<string, HTMLImageElement>();
        for (const flowerData of flowersFromDB) {
          try {
            const base64Data = await window.electronAPI.getFlowerImage(flowerData.title);
            const img = new Image();
            await new Promise((resolve, reject) => {
              img.onload = () => resolve(img);
              img.onerror = () => reject();
              img.src = base64Data;
            });
            cache.set(flowerData.title, img);
          } catch (error) {}
        }
        setFlowerCache(cache);
      } catch (error) {}
    };
    loadAllFlowerImages();
  }, []);

  const loadFlower = (name: string, flower_type_id: number = 1) => {
    if (window.electronAPI) { // десктоп версия
      const cachedImage = flowerCache.get(name);
      if (!cachedImage) // при второй загрузке цветы должны быть в кэше
        return;
      const newFlower = {
        id: Math.random().toString(36).slice(2),
        name,
        image: cachedImage,
        width: cachedImage.width,
        height: cachedImage.height,
        x: 800,
        y: 200,
        zIndex: flowers.length,
        scale: 0.7,
        rotation: 0,
        currentAngle: 0,
        flower_type_id,
        angles: {
          width: Math.floor(cachedImage.width / 4),
          height: cachedImage.height,
        },
      } as FlowerType;
      setFlowers(prev => [...prev, newFlower]);
      setIsDirty(true);
    } else { // загрузка цветов для демо браузера
      const fileName = `${name.replace(/\s+/g, '-')}.png`;
      const imagePath = `./images/flowers/${fileName}`;
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = imagePath;
      img.onload = () => {
        const newFlower = {
          id: Math.random().toString(36).slice(2),
          name,
          image: img,
          width: img.width,
          height: img.height,
          x: 800,
          y: 200,
          zIndex: flowers.length,
          scale: 0.7,
          rotation: 0,
          currentAngle: 0,
          flower_type_id,
          angles: {
            width: Math.floor(img.width / 4),
            height: img.height,
          },
        } as FlowerType;
        setFlowers(prev => [...prev, newFlower]);
        setIsDirty(true);
      };
    }
  };

  // точечное обновление по id цветка
  const updateFlower = (id: string, updates: Partial<FlowerType>) => {
    setFlowers(prev => 
      prev.map(flower => flower.id === id ? {...flower, ...updates} : flower)
    );
    setIsDirty(true);
  };

  // не используется
  const bringToFront = (id: string) => {
    setFlowers(prev => {
      const maxZIndex = Math.max(...prev.map(flower => flower.zIndex), 0);
      return prev.map(flower => flower.id === id ? {...flower, zIndex: maxZIndex + 1} : flower);
    });
    setIsDirty(true);
  };

  // удаление
  const removeFlower = (id: string) => {
    setFlowers(prev => prev.filter(flower => flower.id !== id));
    setIsDirty(true);
  };

  const updateAllFlowers = (updates: (flower: FlowerType) => Partial<FlowerType>) => {
    setFlowers(prev => prev.map(flower => ({ ...flower, ...updates(flower) })));
    setIsDirty(true);
  };

  const markAsSaved = (project: ProjectItem) => {
    setIsDirty(false);
    setCurrentProject(project);
  }

  const resetProject = () => {
    setFlowers([]);
    setCurrentProject(null);
    setIsDirty(false);
  };

  return { 
    flowers, 
    loadFlower, 
    updateFlower,
    removeFlower,
    bringToFront,
    setFlowers,
    updateAllFlowers,
    flowerCache,
    isDirty,
    setIsDirty,
    currentProject,
    setCurrentProject,
    markAsSaved,
    resetProject
  };
};
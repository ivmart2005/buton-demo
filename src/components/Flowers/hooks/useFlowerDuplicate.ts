import { useFlowersContext } from '@/contexts/FlowersContext';
import { FlowerType } from '@/types';

export const useFlowerDuplicate = () => {
  const { flowers, setFlowers } = useFlowersContext();

  const duplicateFlower = (flowerId: string) => {
    console.log(`Duplicate flower ${flowerId}`);
    const originalFlower = flowers.find(f => f.id === flowerId);
    if (!originalFlower) return;

    const duplicatedFlower: FlowerType = {
      ...originalFlower,
      id: Math.random().toString(36).slice(2),
      x: originalFlower.x + 20,
      y: originalFlower.y + 20,
      zIndex: Math.max(...flowers.map(f => f.zIndex), 0) + 1
    };

    setFlowers(prev => [...prev, duplicatedFlower]);
  };

  return { duplicateFlower };
};
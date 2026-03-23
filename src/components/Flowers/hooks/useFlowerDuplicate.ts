import { useFlowersContext } from "@/contexts/FlowersContext";
import { FlowerType } from "@/types";

export const useFlowerDuplicate = () => {
  const {flowers, setFlowers} = useFlowersContext();
  const duplicateFlower = (flowerId: string) => {
    const originalFlower = flowers.find(f => f.id === flowerId);
    if (!originalFlower)
      return;
    const duplicatedFlower: FlowerType = {
      ...originalFlower,
      id: Math.random().toString(36).slice(2),
      x: originalFlower.x + 30,
      y: originalFlower.y + 30,
      zIndex: Math.max(...flowers.map(flower => flower.zIndex), 0) + 1
    };
    setFlowers(prev => [...prev, duplicatedFlower]);
  };
  return { duplicateFlower };
};
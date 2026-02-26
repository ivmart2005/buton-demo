import { useFlowersContext } from '@/contexts/FlowersContext';

export const useFlowerMirror = () => {
  const { updateFlower, flowers } = useFlowersContext();

  const mirrorFlower = (flowerId: string) => {
    const flower = flowers.find(f => f.id === flowerId);
    if (!flower) return;
    const isFlipped = !(flower as any).isFlipped;
    updateFlower(flowerId, {
      isFlipped: isFlipped
    } as any);
  };

  return { mirrorFlower };
};
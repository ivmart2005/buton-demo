import { useFlowersContext } from '@/contexts/FlowersContext';

export const useFlowerReset = () => {
  const { updateFlower } = useFlowersContext();

  const resetFlower = (flowerId: string) => {
    console.log(`Ресет цветка: ${flowerId}`);
    updateFlower(flowerId, {
      scale: 0.7,
      rotation: 0,
      saturation: 1.0,
      currentAngle: 0
    });
  };

  return { resetFlower }; // эта функция вернется в Flower.tsx
};
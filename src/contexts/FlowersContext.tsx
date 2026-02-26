import { createContext, useContext } from 'react';
import { useFlowers } from '@/hooks/useFlowers';
// контекст - данные, "ящик с данными"
const FlowersContext = createContext<ReturnType<typeof useFlowers> | null>(null);

export const FlowersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const flowersData = useFlowers();
  return (
    // провайдер - "упаковщик данных", засовывает данные в ящик-контекст
    // данные будут доступны всем дочерним элементам
    <FlowersContext.Provider value={flowersData}>
      {children}
    </FlowersContext.Provider>
  );
};

export const useFlowersContext = () => {
  const context = useContext(FlowersContext);
  if (!context) {
    throw new Error('useFlowersContext ОШИБКА');
  }
  return context;
};
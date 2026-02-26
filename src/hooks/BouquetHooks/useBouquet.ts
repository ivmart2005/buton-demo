
import { useConvertBouquet } from './useConvertBouquet';

export const useBouquet = () => {
  const { convert } = useConvertBouquet();

  return {
    convert
  };
};

export {  useConvertBouquet };
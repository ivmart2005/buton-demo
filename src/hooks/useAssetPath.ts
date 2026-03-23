export const useAssetPath = (path: string) => {
  const result = `../public${path}`;
  return result;
};
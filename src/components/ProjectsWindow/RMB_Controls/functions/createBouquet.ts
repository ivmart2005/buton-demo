export const createBouquet = async (currentPath: string): Promise<string | null> => {
  try {
    const newFilePath = await window.electronAPI.createNewBouquet(currentPath);
    
    if (!newFilePath) {
      throw new Error("createBouquet - Не найден путь к файлу");
    }

    return newFilePath;
  } catch (error) {
    console.error("createBouquet - Ошибка при создании букета:", error);
    return null;
  }
};
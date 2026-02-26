export const createCanvas = async (currentPath: string): Promise<string | null> => {
  try {
    const newFolderPath = await window.electronAPI.createNewFolder(currentPath);
    
    if (!newFolderPath) {
      throw new Error("createCanvas - Путь к папке не был получен");
    }

    return newFolderPath;
  } catch (error) {
    console.error("createCanvas - Ошибка при создании папки:", error);
    return null;
  }
};
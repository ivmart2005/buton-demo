export const renameItem = async (oldPath: string, newName: string): Promise<boolean> => {
  if (!newName || newName.trim() === "") return false;

  try {
    const result = await window.electronAPI.renameProjectItem(oldPath, newName);
    return !!result; 
  } catch (error) {
    console.error("renameItem - Ошибка при переименовании:", error);
    return false;
  }
};
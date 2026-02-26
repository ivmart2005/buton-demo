import { useState, useEffect } from 'react';
import { ProjectStructure } from '@/types/project';

export const useProjects = () => {
  const [currentPath, setCurrentPath] = useState<string>('');
  const [structure, setStructure] = useState<ProjectStructure | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStructure = async (path: string = '') => {
    if (!window.electronAPI?.getProjectsStructure) {
      console.warn('Electron API не доступен');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await window.electronAPI.getProjectsStructure(path);
      setStructure(data);
      setCurrentPath(data.path);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (window.electronAPI) {
      loadStructure();
    }
  }, []);

  const enterFolder = (folderPath: string) => {
    loadStructure(folderPath);
  };

  const goBack = () => {
    if (structure?.parentPath !== null) {
      loadStructure(structure?.parentPath || '');
    }
  };

  const createFolder = async (folderName: string) => {
    if (!window.electronAPI?.createProjectFolder) return;

    try {
      await window.electronAPI.createProjectFolder(currentPath, folderName);
      await loadStructure(currentPath);
    } catch (err: any) {
      throw err;
    }
  };

  return {
    currentPath,
    structure,
    isLoading,
    error,
    loadStructure,
    enterFolder,
    goBack,
    createFolder
  };
};
'use strict';

const { contextBridge, ipcRenderer } = require('electron');

if (!ipcRenderer) {
  window.electronAPI = null;
} else {
  const electronAPI = {
    // цветы для библиотеки
    getFlowers: () => ipcRenderer.invoke('get-flowers'),
    getFlowerImage: (name) => ipcRenderer.invoke('get-flower-image', name),
    getFlowerTypes: () => ipcRenderer.invoke('get-flower-types'), 
    getFlowerTypeById: (id) => ipcRenderer.invoke('get-flower-type-by-id', id),
    // загрузка и сохранение букетов
    loadBouquetFromPath: (path) => ipcRenderer.invoke('load-bouquet-from-path', path),
    saveBouquetToPath: (bouquetData) => ipcRenderer.invoke('save-bouquet-to-path', bouquetData),
    // исследование структуруы дерева проектов
    getProjectsStructure: (path) => ipcRenderer.invoke('get-projects-structure', path),
    createProjectFolder: (path, name) => ipcRenderer.invoke('create-project-folder', path, name),
    // работа с файлами и папками
    createNewBouquet: (targetDir) => ipcRenderer.invoke('fs:create-bouquet', targetDir),
    createNewFolder: (targetDir) => ipcRenderer.invoke('fs:create-folder', targetDir),
    renameProjectItem: (oldPath, newName) => ipcRenderer.invoke('fs:rename-item', oldPath, newName),
    deleteProjectItem: (path) => ipcRenderer.invoke('fs:delete-item', path),
    // вставка папок и файлов
    pasteItem: (data) => ipcRenderer.invoke('fs:paste-item', data),
  };

  if (process.contextIsolated) {
    contextBridge.exposeInMainWorld('electronAPI', electronAPI);
  } else {
    window.electronAPI = electronAPI;
  }
}
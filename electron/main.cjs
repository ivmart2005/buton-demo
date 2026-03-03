const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const flowerHandlers = require('./handlers/flowerHandlers.cjs');
const typeHandlers = require('./handlers/typeHandlers.cjs');
const { getDatabase, closeDatabase } = require('./database/connection.cjs');
const BouquetFileManager = require('./managers/BouquetFileManager/index.cjs');
const ProjectsTreeManager = require('./managers/ProjectsTreeManager/index.cjs');
const FileSystemManager = require('./managers/FileSystemManager/index.cjs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  const indexPath = app.isPackaged 
    ? path.join(__dirname, '../dist/index.html')
    : 'dist/index.html';  
  mainWindow.loadFile(indexPath);
  mainWindow.once('ready-to-show', () => mainWindow.show());
  //mainWindow.webContents.openDevTools();
}

// обработчики
function registerHandlers() {
  ipcMain.handle('fs:delete-item', FileSystemManager.handleDeleteItem);
  ipcMain.handle('fs:create-bouquet', FileSystemManager.handleCreateBouquet);
  ipcMain.handle('fs:create-folder', FileSystemManager.handleCreateFolder);
  ipcMain.handle('fs:rename-item', FileSystemManager.handleRenameItem);

  ipcMain.handle('fs:paste-item', FileSystemManager.handlePasteItem);

  // букеты
  ipcMain.handle('load-bouquet-from-path', BouquetFileManager.loadBouquetFromPath);
  ipcMain.handle('save-bouquet-to-path', BouquetFileManager.saveBouquetToPath);
  // проекты
  ipcMain.handle('get-projects-structure', ProjectsTreeManager.scanProjectsDirectory);
  ipcMain.handle('create-project-folder', ProjectsTreeManager.createProjectFolder);
  // цветы
  ipcMain.handle('get-flowers', flowerHandlers.getFlowers);
  ipcMain.handle('get-flower-image', flowerHandlers.getFlowerImage);
  ipcMain.handle('get-flower-types', typeHandlers.getFlowerTypes);
  ipcMain.handle('get-flower-type-image', typeHandlers.getFlowerTypeImage);
  ipcMain.handle('get-flower-type-by-id', typeHandlers.getFlowerTypeById);
}

app.whenReady().then(() => {
  createWindow();
  registerHandlers();
});

app.on('window-all-closed', async () => {
  try {
    await closeDatabase();
  } catch (error) {
    console.error('main.cjs - ошибка закрытия БД:', error);
  }
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
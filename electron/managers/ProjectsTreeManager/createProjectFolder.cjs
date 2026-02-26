const path = require('path');
const fs = require('fs').promises;
const getProjectsRoot = require('./getProjectsRoot.cjs');

async function createProjectFolder(event, relativePath, folderName) {
  try {    
    const projectsRoot = getProjectsRoot();
    const newFolderPath = path.join(projectsRoot, relativePath, folderName);
    
    // создание папки
    await fs.mkdir(newFolderPath, { recursive: true });
    await fs.access(newFolderPath);
    
    return { 
      success: true, 
      path: newFolderPath,
      relativePath: path.join(relativePath, folderName)
    };
    
  } catch (error) {
    console.error("createProjectFolder - ошибка создания папки", error);
    throw error;
  }
}

module.exports = createProjectFolder;
const path = require('path');
const fs = require('fs').promises;
const getProjectsRoot = require('./getProjectsRoot.cjs');

async function scanProjectsDirectory(event, relativePath = '') {
  try {
    const projectsRoot = getProjectsRoot();
    const currentPath = path.join(projectsRoot, relativePath);
    try { // проверка на папку "Projects"
      await fs.access(projectsRoot);
    } catch (error) { // создание, если её нет
      await fs.mkdir(projectsRoot, { recursive: true });
    }
    await fs.access(currentPath);
    // чтение
    const items = await fs.readdir(currentPath, { withFileTypes: true });
    const result = {
      path: relativePath || '/',
      parentPath: relativePath ? path.dirname(relativePath) || '/' : null,
      items: []
    };
    
    // обработка папок и файлов
    for (const item of items) {
      const itemPath = path.join(relativePath, item.name);
      const fullPath = path.join(currentPath, item.name);
      // папка
      if (item.isDirectory()) {
        const stats = await fs.stat(fullPath);
        result.items.push({
          name: item.name,
          type: 'folder',
          path: itemPath,
          modified: stats.mtime.toISOString(),
          size: stats.size
        });
      } else if (item.name.endsWith('.json')) { // если файл json
        const stats = await fs.stat(fullPath);
        result.items.push({
          name: item.name,
          type: 'file',
          path: itemPath,
          size: stats.size,
          modified: stats.mtime.toISOString()
        });
      }
    }
    
    // папки сверху над файлами
    result.items.sort((a, b) => {
      if (a.type === 'folder' && b.type === 'file') return -1;
      if (a.type === 'file' && b.type === 'folder') return 1;
      return a.name.localeCompare(b.name);
    });
    return result;
  } catch (error) {
    throw error;
  }
}

module.exports = scanProjectsDirectory;
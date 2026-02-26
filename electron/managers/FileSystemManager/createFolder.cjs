const fs = require('fs');
const path = require('path');

const createFolder = async (projectsRoot, targetDir) => {
  let name = "Новая папка";
  let folderPath = path.join(projectsRoot, targetDir, name);
  let counter = 1;
  while (fs.existsSync(folderPath)) {
    folderPath = path.join(projectsRoot, targetDir, `${name} (${counter})`); // "Новая папка (1)"
    counter++;
  }
  fs.mkdirSync(folderPath, { recursive: true });
  return folderPath;
};

module.exports = createFolder;
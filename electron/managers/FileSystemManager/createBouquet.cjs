const fs = require('fs');
const path = require('path');

const createBouquet = async (projectsRoot, targetDir) => {
  let name = "Новый букет";
  let extension = ".json";
  let filePath = path.join(projectsRoot, targetDir, name + extension);
  let counter = 1;
  while (fs.existsSync(filePath)) {
    filePath = path.join(projectsRoot, targetDir, `${name} (${counter})${extension}`); // Новая папка (1), (2), ...
    counter++;
  }
  
  const initialData = JSON.stringify([], null, 2);
  fs.writeFileSync(filePath, initialData);
  
  return filePath;
};

module.exports = createBouquet;
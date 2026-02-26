const fs = require('fs');
const path = require('path');

const renameItem = async (oldPath, newName) => {
  try {
    const dir = path.dirname(oldPath);
    const ext = path.extname(oldPath);
    const finalName = newName.endsWith(ext) ? newName : `${newName}${ext}`;
    const newPath = path.join(dir, finalName);

    if (oldPath === newPath)
      return true;

    if (fs.existsSync(newPath)) {
      console.log('Объект с таким именем уже существует');
    }

    fs.renameSync(oldPath, newPath);
    return newPath;
  }
  catch (error) {
    if (error.code === 'EPERM')
    {
      console.log(`renameItem.cjs - ошибка разрешения - ${error.message}`);
    }
    throw error;
  }
};

module.exports = renameItem;
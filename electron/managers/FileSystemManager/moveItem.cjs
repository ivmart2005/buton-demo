const fs = require('fs');

const moveItem = async (src, dest) => {
  if (fs.existsSync(dest)) {
    throw new Error('Файл с таким именем уже существует в папке назначения');
  }
  // rename в Node.js работает как перемещение
  fs.renameSync(src, dest);
  return dest;
};

module.exports = moveItem;
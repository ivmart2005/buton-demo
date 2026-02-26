const fs = require('fs');

const deleteItem = async (targetPath) => {
  try {
    if (!fs.existsSync(targetPath)) {
      throw new Error('deleteitem.cjs - не удалось найти объект');
    }
    fs.rmSync(targetPath, { recursive: true, force: true });
    return true;
  } catch (error) {
    console.error('deleteitem.cjs - не удалось удалить объект', error);
    throw error;
  }
};

module.exports = deleteItem;
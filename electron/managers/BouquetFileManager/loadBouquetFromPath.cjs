const path = require('path');
const fs = require('fs').promises;
const { app } = require('electron');

// загрузка json букета из папки проектов
async function loadBouquetFromPath(event, filePath) {
  try {
    const bouquetPath = path.join(path.dirname(process.execPath), filePath);
    try {
      await fs.access(bouquetPath);
    } catch (error) {
      throw new Error("loadBouquetFromPath.cjs - файл не найден: " + filePath);
    }
    // чтение json букета
    const data = await fs.readFile(bouquetPath, 'utf8');
    const bouquet = JSON.parse(data); // букет загружен
    return bouquet.flowers;
  } catch (error) {
    throw new Error(`loadBouquetFromPath.cjs - ошибка загрузки букета: ${error.message}`);
  }
}

// common.js экспорт
module.exports = loadBouquetFromPath;
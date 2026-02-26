const fs = require('fs').promises;
const path = require('path');

async function saveBouquetToPath(event, bouquetData) {
  try {
    const { flowers, filePath } = bouquetData;
    // оставить на всякий случай (бесполезно)
    if (!flowers || !Array.isArray(flowers)) {
      throw new Error('saveBouquetToPath - переданы некорректные данные');
    }
    if (!filePath || typeof filePath !== 'string') {
      throw new Error('saveBouquetToPath - некорректный путь для сохранения файла');
    }

    let fullPath = path.join(path.dirname(process.execPath), filePath);
    const dir = path.dirname(fullPath);
    try {
      await fs.access(dir);
    } catch (error) { // если папки нет, то создать её
      await fs.mkdir(dir, { recursive: true });
    }
    const fileName = path.basename(fullPath, '.json');
    const timestamp = new Date().toISOString();
    const bouquetToSave = {
      id: Date.now().toString(),
      name: fileName,
      createdAt: timestamp,
      lastModified: timestamp,
      flowers: flowers.map(flower => ({
        flowerName: flower.flowerName,
        flower_type_id: flower.flower_type_id || 1,
        x: flower.x || 0,
        y: flower.y || 0,
        zIndex: flower.zIndex || 0,
        scale: flower.scale || 0.7,
        rotation: flower.rotation || 0,
        currentAngle: flower.currentAngle || 0,
        saturation: flower.saturation || 1.0,
        isFlipped: flower.isFlipped || false
      }))
    };
    // сохранение
    const jsonData = JSON.stringify(bouquetToSave, null, 2);
    await fs.writeFile(fullPath, jsonData, 'utf8');
    // размеры
    await fs.access(fullPath);
    const stats = await fs.stat(fullPath);
    
    return {
      success: true,
      path: fullPath,
      fileName: fileName,
      savedAt: timestamp
    };
  } catch (error) {
    throw new Error(`saveBouquetToPath - не удалось сохранить букет - ${error.message}`);
  }
}

module.exports = saveBouquetToPath;
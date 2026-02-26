const flowersRepository = require('../database/flowers.cjs');

const flowerHandlers = {
  async getFlowers() {
    try {
      const flowers = await flowersRepository.getAllFlowers();
      return flowers.map(flower => ({
        id: flower.id.toString(),
        title: flower.name,
        x: flower.preview_x || 0,
        y: flower.preview_y || 0,
        colorId: flower.colour || 1,
        flower_type_id: flower.flower_type_id || 1
      }));
    } catch (error) {
      console.error('flowerHandlers - getFlowers - цветы не получены', error.message);
      return [];
    }
  },

  async getFlowerImage(event, flowerName) {
    try {
      const base64Image = await flowersRepository.getFlowerImageBase64(flowerName);
      if (!base64Image) {
        throw new Error(`flowerHandlers - getFlowerImage - картинка по имени не получена ${flowerName}`);
      }
      return `data:image/png;base64,${base64Image}`;
    } catch (error) {
      console.error('flowerHandlers - getFlowerImage - картинка не получена', error.message);
      throw error;
    }
  }
};

module.exports = flowerHandlers;
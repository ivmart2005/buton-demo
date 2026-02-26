const typesPath = require('../database/types.cjs');

// отвечает за фильтры окна фильтров по виду (типу) цветка
const typeHandlers = {
  async getFlowerTypes() {
    try {
      const types = await typesPath.getAllTypes();
      return types.map(type => ({
        id: type.id,
        name: type.name,
        picture: type.picture
      }));
    } catch (error) {
      console.error('typeHandlers.cjs error - getFlowerTypes - не удалось получить цветы', error.message);
      return [];
    }
  },

  async getFlowerTypeImage(event, typeId) {
    try {
      const base64Image = await typesPath.getTypeImageBase64(typeId);
      if (!base64Image) {
        throw new Error(`typeHandlers.cjs error - getFlowerTypeImage - не получена картинка типа с id: ${typeId}`);
      }
      return `data:image/png;base64,${base64Image}`;
    } catch (error) {
      console.error('typeHandlers.cjs error - getFlowerTypeImage - не получена картинка типа', error.message);
      throw error;
    }
  },

  async getFlowerTypeById(event, typeId) {
    try {
      const type = await typesPath.getTypeById(typeId);
      if (!type)
        return null;
      if (type.picture) { // если в строке БД была картинка base64
        const base64Image = type.picture.toString('base64');
        return {
          id: type.id,
          name: type.name,
          picture: `data:image/png;base64,${base64Image}`
        };
      }
      return {
        id: type.id,
        name: type.name,
        picture: null
      };
    } catch (error) {
      console.error('typeHandlers.cjs error - getFlowerTypeById - не получен тип по id:', error.message);
      throw error;
    }
  }
};

module.exports = typeHandlers;
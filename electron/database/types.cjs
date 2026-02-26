const { getDatabase } = require('./connection.cjs');

const typesRepository = {
  async getAllTypes() { // полная информация о типах
    const db = await getDatabase();
    return db.all('SELECT id, name, picture FROM Flowers_Codes ORDER BY name');
  },

  async getTypeById(id) {
    const db = await getDatabase();
    return db.get('SELECT id, name, picture FROM Flowers_Codes WHERE id = ?', [id]);
  },

  async getTypeImageBase64(id) {
    const type = await this.getTypeById(id);
    if (!type || !type.picture) return null;
    return type.picture.toString('base64');
  }
};

module.exports = typesRepository;
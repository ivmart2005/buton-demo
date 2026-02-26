const { getDatabase } = require('./connection.cjs');

const flowersRepository = {
  async getAllFlowers() {
    const db = await getDatabase(); // полная информация о всех цветах
    return db.all(`
      SELECT id, name, colour, preview_x, preview_y, flower_type_id 
      FROM Flowers 
      ORDER BY name
    `);
  },

  async getFlowerByName(name) {
    const db = await getDatabase();
    return db.get('SELECT image FROM Flowers WHERE name = ?', [name]);
  },

  async getFlowerImageBase64(name) {
    const flower = await this.getFlowerByName(name);
    if (!flower || !flower.image) return null;
    return flower.image.toString('base64');
  }
};

module.exports = flowersRepository;
const { Select, Insert } = require('../sql/sqlFunctions');
const safeJsonParse = require('../extraFunctions/safeJsonParse');

module.exports = {
  getItems: async (_, res) => {
    try {
      const customQuery = `
        SELECT *
        FROM items
        LEFT JOIN armor
        ON items.id = armor.id
        LEFT JOIN buff
        ON items.id = buff.id
        LEFT JOIN food
        ON items.id = food.id
        LEFT JOIN tool
        ON items.id = tool.id
        LEFT JOIN weapon
        ON items.id = weapon.id`;

      const items = await Select(customQuery, null, where);

      console.log(items);

      res.status(200).send(items);
    } catch (error) {
      const { code = 500, message = error.message } = safeJsonParse(error.message);
      res.status(code).send(message);
    }
  },
  createItems: async (req, res) => {
    const { items } = req.body;

    try {
      items.forEach(async (item) => {
        if (item) {
          const tableItem = {
            ...item,
            type: item.type.name,
          };

          const type = {
            ...item.type,
            id: item.id,
          };

          await Insert('items', Object.keys(tableItem), Object.values(tableItem));

          if (item.type !== 'misc' && item.type !== 'material') {
            const { name } = type;
            delete type.name;

            await Insert(name, Object.keys(type), Object.values(type));
          }
        }
      });

      res.status(200).send('success');
    } catch (error) {
      const { code = 500, message = error.message } = safeJsonParse(error.message);
      res.status(code).send(message);
    }
  },
};

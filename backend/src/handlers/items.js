const { Select, Insert } = require('../sql/sqlFunctions');

module.exports = {
  getItems: async (req, res) => {
    const id = (req.body.id) ? req.body.id : null;
    const type = (req.body.type) ? req.body.type : null;
    let where = (req.body.where) ? req.body.where : null;

    if (id && where) {
      res.status(400).send('Cannot specify both id and where clause!');
    } else if (id && type) {
      where = `id = '${id}' AND type = '${type}'`;
    }

    try {
      if (where) res.status(200).send(await Select(null, 'items', where));

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

      res.status(200).send(await Select(customQuery, null, where));
    } catch (error) {
      const { code, message } = JSON.parse(error.message);
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
      const { code, message } = JSON.parse(error.message);
      res.status(code).send(message);
    }
  },
};

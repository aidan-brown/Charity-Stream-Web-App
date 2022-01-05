const { Select, Insert } = require('../sql/sqlFunctions');
const safeJsonParse = require('../extraFunctions/safeJsonParse');

module.exports = {
  getItems: async (_, res) => {
    try {
      const items = await Select(null, 'items', null);
      const mappedItems = await Promise.all(items.map(async (item) => {
        const { type, id } = item;

        if (type !== 'misc' && type !== 'material') {
          const [typeInfo] = await Select(null, type, `id ='${id}'`);

          return {
            ...item,
            ...typeInfo,
          };
        }

        return item;
      }));

      res.status(200).send(mappedItems);
    } catch (error) {
      const { code = 500, message = error.message } = safeJsonParse(error.message);
      res.status(code).send(message);
    }
  },
  createItems: async (req, res) => {
    const items = req.body;

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

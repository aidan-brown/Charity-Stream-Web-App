const { PriceOverride } = require('../sql/models');
const { all } = require('../minecraftData');

module.exports = {
  getPriceOverrides: async (_, res) => {
    try {
      const priceOverrides = await PriceOverride.findAll();

      res.status(200).send(priceOverrides);
    } catch (__) {
      res.status(500).send('Something went wrong when trying to get the price overrides');
    }
  },
  createPriceOverrides: async (req, res) => {
    const { body: elements } = req;

    try {
      const errors = [];
      Promise.all(await elements.map(async ({ id, price, type }) => {
        const item = all.find((c) => c.type === type && c.id === id);

        if (item) {
          const priceOverride = await PriceOverride.findOne({ where: { id, type } });

          console.log(item.price);
          console.log(price);

          if (!priceOverride) {
            await PriceOverride.create({ id, price, type });
          } else if (item.price === price) {
            await PriceOverride.destroy({ where: { id, type } });
          } else {
            await PriceOverride.update({ price }, { where: { id, type } });
          }
        } else {
          errors.push(`${id} is not a valid item`);
        }
      }));

      if (errors.length > 0) res.status(400).send({ errors });
      else res.status(200).send({ message: 'Success' });
    } catch (_) {
      res.status(500).send('Failed to update elements');
    }
  },
};

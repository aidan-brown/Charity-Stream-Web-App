const { PriceOverride } = require('../sql/models');
const { all } = require('../minecraftData');
const { logger } = require('../utils');

module.exports = {
  getPriceOverrides: async (_, res) => {
    try {
      const priceOverrides = await PriceOverride.findAll();

      res.status(200).send(priceOverrides);
    } catch (error) {
      logger.log('GET_PRICE_OVERRIDES_ERROR', 'Error getting the price Overrides', { error });

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

          if (!priceOverride && price && Number(item.price) !== Number(price)) {
            await PriceOverride.create({ id, price, type });
          } else if (Number(item.price) === Number(price) || price === null) {
            await PriceOverride.destroy({ where: { id, type } });
          } else {
            await PriceOverride.update({ price }, { where: { id, type } });
          }
        } else {
          errors.push(`${id} is not a valid item`);
        }
      }));

      if (errors.length > 0) {
        logger.log('CREATE_PRICE_OVERRIDES_ERROR', 'Error creating the price overrides', { errors });

        res.status(400).send({ errors });
      } else res.status(200).send({ message: 'Success' });
    } catch (error) {
      logger.log('CREATE_PRICE_OVERRIDES_ERROR', 'Error creating the price overrides', { error });

      res.status(500).send('Failed to create price overrides');
    }
  },
};

const { PriceOverride } = require('../sql/models');

module.exports = {
  createPriceOverrides: async (req, res) => {
    const { body: elements } = req;

    try {
      await elements.forEach(async ({ id, price, type }) => {
        const priceOverride = await PriceOverride.findOne({ where: { id, type } });

        if (!priceOverride) await PriceOverride.create({ id, price, type });
        else {
          await PriceOverride.destroy({ where: { id, type } });
        }
      });

      res.send('Success').status(200);
    } catch (_) {
      res.status(500).send('Failed to update elements');
    }
  },
};

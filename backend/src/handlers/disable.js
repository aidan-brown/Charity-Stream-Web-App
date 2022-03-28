const { DisabledElement } = require('../sql/models');

module.exports = {
  getCheckoutStatus: async (_, res) => {
    try {
      const { disabled } = await DisabledElement.findByPk('checkout-disable') || {};

      res.status(200).send(!!disabled);
    } catch (__) {
      res.status(500).send('Something went wrong when trying to get checkout');
    }
  },
  disableCheckout: async (req, res) => {
    const { status } = req.body;

    if (status !== true && status !== false) {
      res.status(400).send('Value must be true or false');
    }

    try {
      const checkout = await DisabledElement.findByPk('checkout-disable');

      if (checkout) {
        await DisabledElement.update({
          disabled: status,
        },
        {
          where: {
            id: 'checkout-disable',
          },
        });
      } else {
        await DisabledElement.create({
          id: 'checkout-disable',
          disabled: status,
        });
      }

      res.status(200).send('Successfully toggled checkout');
    } catch (_) {
      res.status(500).send('Something went wrong when toggling checkout');
    }
  },
  disableElements: async (req, res) => {
    const { body: elements } = req;

    try {
      await elements.forEach(async ({ id, disabled }) => {
        const foundItem = await DisabledElement.findOne({ where: { id } });

        if (!foundItem) await DisabledElement.create({ id, disabled });
        else {
          await DisabledElement.destroy({ where: { id } });
        }
      });

      res.send('Success').status(200);
    } catch (err) {
      res.send('Failed to update elements').status(500);
    }
  },
};

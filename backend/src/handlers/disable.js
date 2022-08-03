const { DisabledElement } = require('../sql/models');
const { logger } = require('../utils');

module.exports = {
  getCheckoutStatus: async (_, res) => {
    try {
      const { disabled } = await DisabledElement.findOne({
        where: {
          id: 'checkout-disable',
          type: 'checkout',
        },
      }) || {};

      res.status(200).send(!!disabled);
    } catch (error) {
      logger.error('GET_CHECKOUT_FAILED', 'Something went wrong trying to get checkout status', {
        error,
      });

      res.status(500).send('Something went wrong when trying to get checkout');
    }
  },
  disableCheckout: async (req, res) => {
    const { status } = req.body;

    if (status !== true && status !== false) {
      res.status(400).send('Status must be true or false');
      return;
    }

    try {
      const checkout = await DisabledElement.findOne({
        where: {
          id: 'checkout-disable',
          type: 'checkout',
        },
      });

      if (checkout) {
        await DisabledElement.update(
          {
            disabled: status,
          },
          {
            where: {
              id: 'checkout-disable',
              type: 'checkout',
            },
          },
        );
      } else {
        await DisabledElement.create({
          id: 'checkout-disable',
          disabled: status,
          type: 'checkout',
        });
      }

      logger.info('CHECKOUT_TOGGLE', 'Successfully toggled checkout', { status });

      res.status(200).send('Successfully toggled checkout');
    } catch (error) {
      logger.error('TOGGLE_CHECKOUT_FAILED', 'Failed to toggle checkout', { error });

      res.status(500).send('Something went wrong when toggling checkout');
    }
  },
  disableElements: async (req, res) => {
    const { body: elements } = req;

    try {
      await elements.forEach(async ({ id, disabled, type }) => {
        const foundItem = await DisabledElement.findOne({ where: { id, type } });

        if (!foundItem) await DisabledElement.create({ id, disabled, type });
        else {
          await DisabledElement.destroy({ where: { id, type } });
        }
      });

      logger.info('DISABLED_ELEMENTS', 'Successfully disabled elements');

      res.send('Success').status(200);
    } catch (error) {
      logger.error('TOGGLE_ELEMENTS_FAILED', 'Failed to toggle elements', { error });

      res.status(500).send('Failed to update elements');
    }
  },
};

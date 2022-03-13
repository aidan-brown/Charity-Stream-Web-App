const safeJsonParse = require('../utils/safeJsonParse');
const { DisabledElement } = require('../sql/models');

module.exports = {
  getCheckoutStatus: async (_, res) => {
    try {
      const [{ disabled }] = await DisabledElement.findAll({ where: { id: 'checkout' } });

      res.status(200).send(!!disabled);
    } catch (error) {
      const { code = 500, message = error.message } = safeJsonParse(error.message);
      res.status(code).send(message);
    }
  },
  disableCheckout: async (_, res) => {
    try {
      const [checkout] = await DisabledElement.findAll({ where: { id: 'checkout' } });

      await checkout.update({ disabled: !checkout.disabled });

      res.status(200).send(`Successfully ${!checkout.disabled ? 'disabled' : 'enabled'} checkout`);
    } catch (error) {
      const { code = 500, message = error.message } = safeJsonParse(error.message);
      res.status(code).send(message);
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

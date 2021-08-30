const { Select, Update } = require('../sql/sqlFunctions');
const safeJsonParse = require('../extraFunctions/safeJsonParse');
const { isAuthenticated } = require('../handlers/authentication')

module.exports = {
  getCheckoutStatus: async (_, res) => {
    try {
      const [{ disabled }] = await Select(null, 'checkout');

      res.status(200).send(!!disabled);
  } catch (error) {
    const { code = 500, message = error.message } = safeJsonParse(error.message);
    res.status(code).send(message);
  }
  },
  disableCheckout: async (_, res) => {
    const { isAuthenticated: isAuthed, error } = isAuthenticated(req.headers.authorization);

    if (isAuthed) {
      try {
        const [{ disabled }] = await Select(null, 'checkout');

        await Update('checkout', { disabled: disabled === 0 ? 1 : 0 },`id = '1'`);
        res.status(200).send(`Successfully ${disabled === 0 ? 'disabled' : 'enabled'} checkout`);
      } catch (error) {
        const { code = 500, message = error.message } = safeJsonParse(error.message);
        res.status(code).send(message);
      }
    }
    else res.status(401).send(error);
  },
  disableElement: async (req, res) => {
    const { isAuthenticated: isAuthed, error } = isAuthenticated(req.headers.authorization);

    if (isAuthed) {
      const { type, id } = req.params;
      try {
          const [element] = await Select(null, type, `id = '${id}'`);
  
          if (element) {
              await Update(type, { disabled: element.disabled === 0 ? 1 : 0 },`id = '${id}'`);
              res.status(200).send(`Successfully ${element.disabled === 0 ? 'disabled' : 'enabled'} '${id}'`);
          }
          else {
              res.status(400).send('That item does not exist');
          }
  
      } catch (error) {
          console.log(error)
        const { code = 500, message = error.message } = safeJsonParse(error.message);
        res.status(code).send(message);
      }
    }
    else res.status(401).send(error);
  },
};

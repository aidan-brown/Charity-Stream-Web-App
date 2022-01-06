const { Select, Insert } = require('../sql/sqlFunctions');
const safeJsonParse = require('../extraFunctions/safeJsonParse');

module.exports = {
  getEffects: async (_, res) => {
    try {
      res.status(200).send(await Select(null, 'effects'));
    } catch (error) {
      const { code = 500, message = error.message } = safeJsonParse(error.message);
      res.status(code).send(message);
    }
  },
  createEffects: async (req, res) => {
    const { effects } = req.body;

    try {
      effects.forEach((effect) => Insert('effects', Object.keys(effect), Object.values(effect)));

      res.status(200).send('success');
    } catch (error) {
      const { code = 500, message = error.message } = safeJsonParse(error.message);
      res.status(code).send(message);
    }
  },
};

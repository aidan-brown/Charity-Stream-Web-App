const { Select, Insert } = require('../sql/sqlFunctions');
const safeJsonParse = require('../extraFunctions/safeJsonParse');

module.exports = {
  getMobs: async (_, res) => {
    try {
      res.status(200).send(await Select(null, 'mobs'));
    } catch (error) {
      const { code = 500, message = error.message } = safeJsonParse(error.message);
      res.status(code).send(message);
    }
  },
  createMobs: async (req, res) => {
    const { mobs } = req.body;

    try {
      mobs.forEach((mob) => Insert('mobs', Object.keys(mob), Object.values(mob)));

      res.status(200).send('success');
    } catch (error) {
      const { code = 500, message = error.message } = safeJsonParse(error.message);
      res.status(code).send(message);
    }
  },
};

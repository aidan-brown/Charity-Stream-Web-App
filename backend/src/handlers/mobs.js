const { Select, Insert } = require('../sql/sqlFunctions');
const safeJsonParse = require('../extraFunctions/safeJsonParse');
const { isAuthenticated } = require('../handlers/authentication')

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
    const { isAuthenticated: isAuthed, error } = isAuthenticated(req.headers.authorization);

    if (isAuthed) {
      const { mobs } = req.body;

      try {
        mobs.forEach(async mob => await Insert('mobs', Object.keys(mob), Object.values(mob)));
  
        res.status(200).send('success');
      } catch (error) {
        const { code = 500, message = error.message } = safeJsonParse(error.message);
        res.status(code).send(message);
      }
    }
    else res.status(401).send(error);
  },
};

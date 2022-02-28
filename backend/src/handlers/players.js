const { Select, Insert } = require('../sql/sqlFunctions');
const safeJsonParse = require('../utils/safeJsonParse');

module.exports = {
  getPlayers: async (req, res) => {
    const { userName } = req.body;

    try {
      res.status(200).send(await Select(null, 'players', `userName = '${userName}'`));
    } catch (error) {
      const { code = 500, message = error.message } = safeJsonParse(error.message);
      res.status(code).send(message);
    }
  },
  createPlayer: async (req, res) => {
    const { player } = req.body;

    try {
      if (player) {
        await Insert('players', Object.keys(player), Object.values(player));
        res.status(200).send('Success');
      } else {
        res.status(400).send('No Player provided');
      }
    } catch (error) {
      const { code = 500, message = error.message } = safeJsonParse(error.message);
      res.status(code).send(message);
    }
  },
};

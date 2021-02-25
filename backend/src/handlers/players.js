const { Select, Insert } = require('../sql/sqlFunctions');
const { Where } = require('../extraFunctions/whereConstruction');
const safeJsonParse = require('../extraFunctions/safeJsonParse');

module.exports = {
  getPlayers: async (req, res) => {
    let { where } = req.body;
    const { userName } = req.body;

    if (userName && where) {
      res.status(400).send('Cannot specify both username and where clause!');
    } else if (userName) {
      where = `userName = '${userName}'`;
    }

    try {
      if (where) {
        res.status(200).send(await Select(null, 'players', Where(where)));
      }
      res.status(200).send(await Select(null, 'players'));
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

const { Player } = require('../sql/models');

module.exports = {
  getPlayers: async (_, res) => {
    try {
      const players = await Player.findAll();

      res.send(players).status(200);
    } catch (__) {
      res.send('There was an error getting the players').status(500);
    }
  },
  createPlayer: async (req, res) => {
    try {
      const existing = await Player.findAll({ where: { username: req.body.username } });

      if (existing.length === 0) {
        const newPlayer = await Player.create(req.body);

        res.send(newPlayer).status(200);
      } else {
        res.send('A player with that username already exists').status(400);
      }
    } catch (err) {
      console.log(err);
      // They supplied something that is not correct
      if (err.name === 'SequelizeValidationError') {
        const [{ message }] = err.errors;

        res.send(message).status(400);
      } else {
        res.send('An unexpected error occurred with the MySQL server').status(500);
      }
    }
  },
};

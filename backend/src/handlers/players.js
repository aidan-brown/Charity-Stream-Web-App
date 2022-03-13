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
    const player = req.body;

    try {
      const newPlayer = await Player.create(player);

      res.send(newPlayer).status(200);
    } catch (err) {
      res.send('There was an error creating the player').status(500);
    }
  },
};

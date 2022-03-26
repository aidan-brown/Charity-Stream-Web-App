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
  createPlayers: async (req, res) => {
    const players = req.body;

    try {
      const errors = [];
      const newPlayers = await Promise.all(players.map(async (player) => {
        const existing = await Player.findAll({ where: { username: player.username } });

        if (existing.length === 0) return Player.create(player);

        errors.push(`A Player with the username ${player.username} already exists`);
        return null;
      }));

      res.status(errors.length === 0 ? 200 : 400).send({
        ...(errors.length > 0 && { errors }),
        newPlayers: newPlayers.filter((p) => !!p),
      });
    } catch (err) {
      console.log(err);

      if (err.name === 'SequelizeValidationError') {
        const [{ message }] = err.errors;

        res.send(message).status(400);
      } else {
        res.send('An unexpected error occurred with the MySQL server').status(500);
      }
    }
  },
};

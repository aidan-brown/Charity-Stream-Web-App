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

    if (!Array.isArray(players)) {
      res.status(400).send('Must provide array in body');
      return;
    }

    const errors = [];
    const newPlayers = [];
    try {
      await Promise.all(players.map(async (player) => {
        const existing = await Player.findAll({ where: { username: player.username } });

        if (existing.length === 0) {
          newPlayers.push(await Player.create(player));
        } else {
          errors.push(`A Player with the username ${player.username} already exists`);
        }
      }));

      res.status(errors.length === 0 ? 200 : 400).send({
        ...(errors.length > 0 && { errors }),
        newPlayers,
      });
    } catch (err) {
      if (err.name === 'SequelizeValidationError') {
        const [{ message }] = err.errors;

        res.send({ newPlayers, errors: [...errors, message] }).status(400);
      } else {
        res.send({
          errors: [
            ...errors,
            'An unexpected error occurred with the MySQL server'],
        }).status(500);
      }
    }
  },
  deletePlayer: async (req, res) => {
    const { username } = req.params;

    try {
      const toDelete = await Player.findByPk(username);

      if (toDelete) {
        await toDelete.destroy();
        res.status(200).send('Player Deleted');
      } else {
        res.status(404).send('Player not found');
      }
    } catch (err) {
      res.status(500).send('An error occurred');
    }
  },
};

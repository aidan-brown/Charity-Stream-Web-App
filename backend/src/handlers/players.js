const { Player } = require('../sql/models');
const { logger } = require('../utils');

module.exports = {
  getPlayers: async (_, res) => {
    try {
      const players = await Player.findAll();

      res.send(players).status(200);
    } catch (error) {
      logger.log('GET_PLAYERS_ERROR', 'Error getting the players', { error });

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

      if (errors.length > 0) {
        logger.log('CREATE_PLAYERS_ERROR', 'Error creating the players', { errors });
      }

      res.status(errors.length === 0 ? 200 : 400).send({
        ...(errors.length > 0 && { errors }),
        newPlayers,
      });
    } catch (error) {
      logger.log('CREATE_PLAYERS_ERROR', 'Error creating the players', { error });

      if (error.name === 'SequelizeValidationError') {
        const [{ message }] = error.errors;

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
        logger.warn('PLAYER_DELETE_DNE', 'Player does not exist to be deleted', {
          username,
        });

        res.status(404).send('Player not found');
      }
    } catch (error) {
      logger.error('DELETE_PLAYER_ERROR', 'Error deleting the player', { error, username });

      res.status(500).send('An error occurred');
    }
  },
};

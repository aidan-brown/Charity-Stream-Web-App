const { QuickCommand } = require('../sql/models');
const { logger } = require('../utils');

module.exports = {
  getQuickCommands: async (_, res) => {
    try {
      const quickCommands = await QuickCommand.findAll();

      res.status(200).send(quickCommands);
    } catch (error) {
      logger.warn('GET_QUICK_COMMANDS', 'Error getting the quick commands', { error });

      res.status(500).send('Something went wrong when trying to get the quick commands');
    }
  },
  createOrUpdateQuickCommand: async (req, res) => {
    const { body: newCommand } = req;
    const { id } = newCommand;
    try {
      if (!id) {
        const { id: newId } = await QuickCommand.create(newCommand);

        res.status(200).send({ message: 'Success', newId });
      } else {
        await QuickCommand.update(newCommand, {
          where: {
            id,
          },
        });

        res.status(200).send({ message: 'Success' });
      }
    } catch (error) {
      logger.log('CREATE_QUICK_COMMANDS_ERROR', 'Error creating or updating quick command', { error });

      res.status(500).send('Failed to create quick command');
    }
  },
  deleteQuickCommand: async (req, res) => {
    const { commandId } = req.params;
    try {
      await QuickCommand.destroy({
        where: {
          id: commandId,
        },
      });

      res.status(200).send({ message: 'Success' });
    } catch (error) {
      logger.log('DELETE_QUICK_COMMANDS_ERROR', 'Error deleting quick command', { error });

      res.status(500).send('Failed to delete quick command');
    }
  },
};

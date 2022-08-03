const { Rcon } = require('rcon-client');
const { sleep, logger } = require('../utils');

module.exports = {
  runRconCommands: async (req, res) => {
    const commands = req.body;

    try {
      const rcon = await Rcon.connect({
        host: process.env.MC_SERVER_HOST,
        port: process.env.MC_SERVER_RCON_PORT,
        password: process.env.MC_SERVER_RCON_PASSWORD,
      });

      let waits = 0;
      commands.forEach((({ command, shouldWait }) => {
        waits += shouldWait ? 1 : 0;
        sleep(1000 * waits, () => rcon.send(command));
      }));

      logger.info('SCHEDULED_COMMANDS', 'Successfully scheduled commands', { commands });

      res.status(200).send('Those should run TM');
    } catch (error) {
      logger.error('SCHEDULE_COMMANDS_FAILED', 'Failed to schedule RCON commands to be run', {
        error, commands,
      });

      res.status(500).send('Those did not run TM');
    }
  },
};

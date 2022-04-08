const { Rcon } = require('rcon-client');
const { sleep, logger } = require('../utils');

module.exports = {
  runRconCommands: async (req, res) => {
    const commands = req.body;

    try {
      const rcon = await Rcon.connect({
        host: process.env.MCSERVER,
        port: 25569,
        password: process.env.MCSERVERPWRD,
      });

      let waits = 0;
      commands.forEach((({ command, shouldWait }, i) => {
        waits += shouldWait ? 1 : 0;
        sleep(1000 * waits, async () => {
          await rcon.send(command);
          if (i === commands.length - 1) await rcon.end();
        });
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

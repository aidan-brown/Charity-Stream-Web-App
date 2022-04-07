const { Rcon } = require('rcon-client');
const { logger } = require('.');

module.exports = (CommandTable) => async (scheduled) => {
  const cronId = scheduled.getTime();

  try {
    // If any commands need to be run, set the cron timeStamp
    // on the command (max 20)
    const [updates] = await CommandTable.update({ cronId }, {
      where: {
        status: 'READY',
        cronId: null,
      },
      limit: 20,
    });

    // If we found rows to update
    if (updates !== 0) {
      // Get all these updated commands
      const commands = await CommandTable.findAll({
        where: {
          status: 'READY',
          cronId,
        },
      });

      // Connect to the server for this instance
      const rcon = await Rcon.connect({
        host: process.env.MCSERVER,
        port: 25569,
        password: process.env.MCSERVERPWRD,
      });

      // Mark commands as running
      await CommandTable.update({ status: 'RUNNING' }, { where: { cronId } });

      // Now we want to loop through all the commands
      // and run them as many times as
      /* eslint-disable no-await-in-loop */
      for (let i = 0; i < commands.length; i += 1) {
        const { commandText, id } = commands[i];

        // Run the command against the server
        await rcon.send(commandText);

        // Set this command as finished, as it has now run
        await CommandTable.update({ status: 'FINISHED' }, { where: { id } });
      }
      /* eslint-enable no-await-in-loop */

      // Close the command
      await rcon.end();
    }
  } catch (error) {
    logger.error('RCON_SCHEDULE_FAILED', 'Failed to run RCON commands', { error });

    // We want to make sure the failed commands will be run, so we reschedule them
    try {
      await CommandTable.update({ cronId: null, status: 'READY' }, {
        where: {
          cronId,
          status: 'RUNNING',
        },
      });
    } catch (err) {
      logger.error('RCON_SCHEDULE_BACKUP_FAILED', 'Failed to reschedule commands to be run', {
        originalError: error, error: err,
      });
    }
  }
};

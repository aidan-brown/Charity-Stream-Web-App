const { Rcon } = require('rcon-client');
const { Command } = require('../sql/models');

module.exports = async (scheduled) => {
  const cronId = scheduled.getTime();

  try {
    // If any commands need to be run, set the cron timeStamp
    // on the command (max 20)
    const [updates] = await Command.update({ cronId }, {
      where: {
        status: 'READY',
        cronId: null,
      },
      limit: 20,
    });

    // If we found rows to update
    if (updates !== 0) {
      // Get all these updated commands
      const commands = await Command.findAll({
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
      await Command.update({ status: 'RUNNING' }, { where: { cronId } });

      // Now we want to loop through all the commands
      // and run them as many times as
      /* eslint-disable no-await-in-loop */
      for (let i = 0; i < commands.length; i += 1) {
        const { commandText, id } = commands[i];

        // Run the command against the server
        await rcon.send(commandText);

        // Set this command as finished, as it has now run
        await Command.update({ status: 'FINISHED' }, { where: { id } });
      }
      /* eslint-enable no-await-in-loop */

      // Close the command
      await rcon.end();
    }
  } catch (_) {
    // We want to make sure the failed commands will be run, so we reschedule them
    try {
      await Command.update({ cronId: null, status: 'READY' }, {
        where: {
          cronId,
          status: 'RUNNING',
        },
      });
    } catch (err) {
      // If we get here, we are fucked (not really but the db is down)
      // eslint-disable-next-line no-console
      console.log('UH OH STINKY, STINKY POOP (DB AND RCON FAILED UH OH) Error:', err);
    }
  }
};

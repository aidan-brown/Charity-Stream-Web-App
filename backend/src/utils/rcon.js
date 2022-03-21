const { Rcon } = require('rcon-client');
const { Command } = require('../sql/models');

module.exports = async () => {
  try {
    const commands = await Command.findAll({
      where: {
        hasRun: false,
        status: 'READY',
      },
    });

    const rcon = await Rcon.connect({
      host: process.env.MCSERVER,
      port: 25569,
      password: process.env.MCSERVERPWRD,
    });

    /* eslint-disable no-await-in-loop */
    for (let i = 0; i < commands.length; i += 1) {
      const { count, commandText, id } = commands[i];

      // Make sure this command will not be run again (this iteration of the cron will handle it)
      await Command.update({ hasRun: true }, { where: { id } });

      for (let j = 0; j < count; j += 1) await rcon.send(commandText);
    }
    /* eslint-enable no-await-in-loop */

    await rcon.end();
  } catch (err) {
    console.log('SOMETHING WENT WRONG WITH RCON');
    console.log(err);
  }
};

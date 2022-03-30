const { Rcon } = require('rcon-client');
const { sleep } = require('../utils');

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
      commands.forEach((({ command, shouldWait }) => {
        waits += shouldWait ? 1 : 0;
        sleep(1000 * waits, () => rcon.send(command));
      }));

      res.status(200).send('Those should run TM');
    } catch (_) {
      res.status(500).send('Those did not run TM');
    }
  },
};

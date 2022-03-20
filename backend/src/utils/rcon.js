const Rcon = require('modern-rcon');

const RCON = new Rcon(process.env.MCSERVER, 25569, process.env.MCSERVERPWRD, 5000);

module.exports = async () => {
  await RCON.connect();
  const commands = command.split('<&@&>');
  for (let i = 0; i < commands.length; i++) {
    await RCON.send(commands[i]);
  }
  await RCON.disconnect();
};

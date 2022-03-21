const Player = require('./player');
const DisabledElement = require('./disabledElement');
const Checkout = require('./checkout');
const Command = require('./command');

const createTables = async () => {
  const force = true;

  await Player.sync({ force });
  await DisabledElement.sync({ force });
  await Checkout.sync({ force });
  await Command.sync({ force });
};

module.exports = {
  Player,
  DisabledElement,
  Checkout,
  Command,
  createTables,
};

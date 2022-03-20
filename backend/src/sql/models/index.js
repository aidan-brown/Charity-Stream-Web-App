const Player = require('./player');
const DisabledElement = require('./disabledElement');
const Checkout = require('./checkout');
const Command = require('./command');

const createTables = () => {
  const force = false; // process.env.environment !== 'production';

  Player.sync({ force });
  DisabledElement.sync({ force });
  Checkout.sync({ force });
  Command.sync({ force });
};

module.exports = {
  Player,
  DisabledElement,
  Checkout,
  Command,
  createTables,
};

const Player = require('./player');
const DisabledElement = require('./disabledElement');
const Checkout = require('./checkout');
const Command = require('./command');

const createTables = async () => {
  const force = process.env.NODE_ENV !== 'production';

  await Player.sync({ force });
  await DisabledElement.sync({ force });

  // Have to remove the command table first, then make
  // the checkout table before the command table (fk ref)
  if (force) await Command.drop();
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

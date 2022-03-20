const Player = require('./player');
const DisabledElement = require('./disabledElement');
const Checkout = require('./checkout');

const createTables = () => {
  const force = false; // process.env.environment !== 'production';

  Player.sync({ force });
  DisabledElement.sync({ force });
  Checkout.sync({ force });
};

module.exports = {
  Player,
  DisabledElement,
  Checkout,
  createTables,
};

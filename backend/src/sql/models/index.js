const Player = require('./player');
const DisabledElement = require('./disabledElement');

const createTables = () => {
  const force = false; // process.env.environment !== 'production';

  Player.sync({ force });
  DisabledElement.sync({ force });
};

module.exports = {
  Player,
  DisabledElement,
  createTables,
};

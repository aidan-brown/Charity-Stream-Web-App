const Player = require('./player');
const DisabledElement = require('./disabledElement');
const Checkout = require('./checkout');
const Command = require('./command');
const Log = require('./log');
const QuickCommand = require('./quickCommand');
const PriceOverride = require('./priceOverride');

const createTables = async () => {
  const { DEPLOYMENT_ENV, DB_DROP_TABLES } = process.env;
  const force = DB_DROP_TABLES === 'true';
  const alter = DEPLOYMENT_ENV !== 'production';

  await Player.sync({ alter, force });
  await DisabledElement.sync({ alter, force });
  await Log.sync({ alter, force });
  await QuickCommand.sync({ alter, force });
  await PriceOverride.sync({ alter, force });

  // Have to remove the command table first, then make
  // the checkout table before the command table (fk ref)
  if (force) await Command.drop();
  await Checkout.sync({ alter, force });
  await Command.sync({ alter, force });

  return {
    DisabledElement,
    Checkout,
    Command,
    Log,
    QuickCommand,
    Player,
    PriceOverride,
  };
};

module.exports = {
  DisabledElement,
  Checkout,
  Command,
  Log,
  QuickCommand,
  Player,
  PriceOverride,
  createTables,
};

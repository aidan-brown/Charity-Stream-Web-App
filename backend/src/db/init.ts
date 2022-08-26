import dotenv from 'dotenv';
import {
  Player,
  Log,
  QuickCommand,
  Item,
  Command,
  Token,
  Account,
  Checkout
} from './models';

dotenv.config();

export default async function dbInit (): Promise<void> {
  const { DEPLOYMENT_ENV, DB_DROP_TABLES } = process.env;
  const force = DB_DROP_TABLES === 'true';
  const alter = DEPLOYMENT_ENV !== 'production';

  await Player.sync({ alter, force });
  await Log.sync({ alter, force });
  await QuickCommand.sync({ alter, force });
  await Item.sync({ alter, force });

  // Have to remove the command table first, then make
  // the checkout table before the command table (fk ref)
  if (force) {
    await Command.drop();
    await Token.drop();
  }

  // FK refs
  await Account.sync({ alter, force });
  await Token.sync({ alter, force });

  await Checkout.sync({ alter, force });
  await Command.sync({ alter, force });
}

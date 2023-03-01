import dotenv from 'dotenv';
import {
  Account,
  Checkout,
  Command,
  Donation,
  Item,
  Log,
  Player,
  QuickCommand
} from './models';

dotenv.config();

export default async function dbInit (): Promise<void> {
  const { DB_DROP_TABLES } = process.env;
  const shouldDrop = DB_DROP_TABLES === 'true';

  // Add table associations
  Account.hasMany(Donation, { foreignKey: 'accountId', as: 'donations' });
  Donation.belongsTo(Account, { foreignKey: 'accountId' });

  Checkout.hasMany(Command, { foreignKey: 'checkoutId' });
  Command.belongsTo(Checkout, { foreignKey: 'checkoutId' });

  // If we are forcing, we drop all tables first
  if (shouldDrop) {
    await Donation.drop();
    await Account.drop();

    await Command.drop();
    await Checkout.drop();

    await Item.drop();
    await Log.drop();
    await Player.drop();
    await QuickCommand.drop();
  }

  await Account.sync();
  await Checkout.sync();
  await Command.sync();
  await Donation.sync();
  await Item.sync();
  await Log.sync();
  await Player.sync();
  await QuickCommand.sync();
}

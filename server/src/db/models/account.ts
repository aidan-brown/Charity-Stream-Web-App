import { DataTypes, Model, Optional } from 'sequelize';
import sequelizeConnection from '../config';

export enum Role {
  ADMIN = 'ADMIN',
  PLAYER = 'PLAYER',
  USER = 'USER',
}

export enum Service {
  GOOGLE = 'GOOGLE',
  TWITCH = 'TWITCH',
  MICROSOFT = 'MICROSOFT',
}

interface AccountAttributes {
  id: string
  service: string
  email?: string
  name?: string
  picture?: string
  locale?: string
  role?: Role
  balance?: number
}

export interface AccountInput extends Optional<AccountAttributes, 'id' | 'service'> {}

class Account extends Model<AccountAttributes, AccountInput> implements AccountAttributes {
  declare id: string;
  declare service: string;
  declare email?: string;
  declare name?: string;
  declare picture?: string;
  declare locale?: string;
  declare role?: Role;
  declare balance?: number;
}

Account.init({
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  service: {
    type: DataTypes.ENUM(
      Service.GOOGLE,
      Service.MICROSOFT,
      Service.TWITCH
    ),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: DataTypes.STRING,
  picture: DataTypes.STRING,
  locale: DataTypes.STRING,
  role: {
    type: DataTypes.ENUM(
      Role.ADMIN,
      Role.PLAYER,
      Role.USER
    ),
    defaultValue: Role.USER
  },
  balance: {
    type: DataTypes.FLOAT,
    defaultValue: 0.00
  }
}, {
  sequelize: sequelizeConnection
});

export default Account;

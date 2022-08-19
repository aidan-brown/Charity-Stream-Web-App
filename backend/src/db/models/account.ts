import { DataTypes, Model, Optional } from 'sequelize'
import { sequelizeConnection } from '..'

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
  role: Role
}

export interface AccountInput extends Optional<AccountAttributes, 'id' | 'service'> {}

export interface AccountOutput extends Required<AccountAttributes> {}

class Account extends Model<AccountAttributes, AccountInput> implements AccountAttributes {
  declare id: string
  declare service: string
  declare email?: string
  declare name?: string
  declare picture?: string
  declare locale?: string
  declare role: Role
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
    allowNull: false,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  picture: {
    type: DataTypes.STRING,
    allowNull: true
  },
  locale: {
    type: DataTypes.STRING,
    allowNull: true
  },
  role: {
    type: DataTypes.ENUM(
      Role.ADMIN,
      Role.PLAYER,
      Role.USER
    ),
    defaultValue: Role.USER
  }
}, {
  sequelize: sequelizeConnection
})

export default Account

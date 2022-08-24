import { DataTypes, Model, Optional } from 'sequelize';
import sequelizeConnection from '../config';
import Account from './account';

interface TokenAttributes {
  accountId: string
  hash: string
  salt: string
}

export interface TokenInput extends Optional<TokenAttributes, 'accountId' | 'hash' | 'salt'> {}

class Token extends Model<TokenAttributes, TokenInput> implements TokenAttributes {
  declare accountId: string;
  declare hash: string;
  declare salt: string;
}

Token.init({
  accountId: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    references: {
      model: Account,
      key: 'id'
    }
  },
  hash: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  salt: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  sequelize: sequelizeConnection
});

Token.belongsTo(Account, {
  foreignKey: 'accountId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

export default Token;

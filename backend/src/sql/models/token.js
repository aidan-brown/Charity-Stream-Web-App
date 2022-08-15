const { DataTypes } = require('sequelize');
const { getConnection } = require('..');
const Account = require('./account');

const sequelize = getConnection();

const Token = sequelize.define('Token', {
  accountId: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    references: {
      model: Account,
      key: 'id',
    },
  },
  hash: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  salt: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  expires: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Token.belongsTo(Account, {
  foreignKey: 'accountId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

module.exports = Token;

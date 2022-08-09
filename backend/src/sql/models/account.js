const { DataTypes } = require('sequelize');
const { getConnection } = require('..');
const { Roles } = require('../../utils/auth');

const sequelize = getConnection();

const Account = sequelize.define('Account', {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  picture: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  locale: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  role: {
    type: DataTypes.ENUM(Roles.ADMIN, Roles.USER),
    defaultValue: Roles.USER,
  },
});

module.exports = Account;

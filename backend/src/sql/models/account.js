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
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  picture: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  locale: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM(Roles.ADMIN, Roles.USER),
    defaultValue: Roles.USER,
  },
});

module.exports = Account;

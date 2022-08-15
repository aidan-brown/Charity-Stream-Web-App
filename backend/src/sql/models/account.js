const { DataTypes } = require('sequelize');
const { getConnection } = require('..');
const { ROLES } = require('../../constants');

const sequelize = getConnection();

const Account = sequelize.define('Account', {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  service: {
    type: DataTypes.ENUM('GOOGLE', 'TWITCH', 'MICROSOFT'),
    allowNull: false,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
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
    type: DataTypes.ENUM(ROLES.ADMIN, ROLES.PLAYER, ROLES.USER),
    defaultValue: ROLES.USER,
  },
});

module.exports = Account;

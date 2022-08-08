const { DataTypes } = require('sequelize');
const { getConnection } = require('..');

const sequelize = getConnection();

const Token = sequelize.define('Token', {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  accessToken: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  refreshToken: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

module.exports = Token;

const { DataTypes } = require('sequelize');
const { getConnection } = require('..');

const sequelize = getConnection();

const Command = sequelize.define('Command', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  cronId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  commandText: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('WAITING', 'READY', 'RUNNING', 'FINISHED'),
    defaultValue: 'WAITING',
  },
});

module.exports = Command;

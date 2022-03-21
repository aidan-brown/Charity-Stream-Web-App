const { DataTypes } = require('sequelize');
const { getConnection } = require('..');

const sequelize = getConnection();

const Command = sequelize.define('Command', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  count: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  commandText: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  hasRun: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  status: {
    type: DataTypes.ENUM('WAITING', 'READY'),
    defaultValue: 'WAITING',
  },
});

module.exports = Command;

const { DataTypes } = require('sequelize');
const { getConnection } = require('..');

const sequelize = getConnection();

const QuickCommand = sequelize.define('QuickCommand', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  variables: {
    type: DataTypes.TEXT,
    defaultValue: '[]',
  },
  commands: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  dataSource: {
    type: DataTypes.TEXT,
  },
});

module.exports = QuickCommand;

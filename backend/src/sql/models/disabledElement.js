const { DataTypes } = require('sequelize');
const { getConnection } = require('..');

const sequelize = getConnection();

const DisabledElement = sequelize.define('DisabledElement', {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  disabled: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});

module.exports = DisabledElement;

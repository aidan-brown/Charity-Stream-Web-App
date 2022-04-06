const { DataTypes } = require('sequelize');
const { getConnection } = require('..');

const sequelize = getConnection();

const PriceOverride = sequelize.define('PriceOverride', {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

module.exports = PriceOverride;

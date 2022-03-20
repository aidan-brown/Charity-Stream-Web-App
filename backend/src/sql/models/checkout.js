const { DataTypes } = require('sequelize');
const { getConnection } = require('..');

const sequelize = getConnection();

const Checkout = sequelize.define('Checkout', {
  command: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  donationID: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'CANCELLED', 'ACCEPTED'),
    allowNull: false,
  },
  subTotal: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

module.exports = Checkout;

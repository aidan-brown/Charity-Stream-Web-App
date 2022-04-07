const { DataTypes } = require('sequelize');
const { getConnection } = require('..');
const Command = require('./command');

const sequelize = getConnection();

const Checkout = sequelize.define('Checkout', {
  donationID: {
    type: DataTypes.STRING,
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

Checkout.hasMany(Command);

module.exports = Checkout;

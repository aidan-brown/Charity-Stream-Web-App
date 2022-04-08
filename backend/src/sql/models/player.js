const { DataTypes } = require('sequelize');
const { getConnection } = require('..');

const sequelize = getConnection();

const Player = sequelize.define('Player', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  association: {
    type: DataTypes.ENUM(
      'csh',
      'blackbaud',
      'hogs',
      'ehouse',
      'sse',
      'arthouse',
      'ihouse',
      'pepband',
      'rit',
      'streamer',
      'other',
    ),
    allowNull: false,
  },
  channel: {
    type: DataTypes.STRING,
  },
  channelType: {
    type: DataTypes.ENUM('TWITCH', 'YOUTUBE'),
  },
  teamSkyWars: {
    type: DataTypes.STRING,
  },
  teamBedsWars: {
    type: DataTypes.STRING,
  },
});

module.exports = Player;

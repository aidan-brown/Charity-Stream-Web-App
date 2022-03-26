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
    type: DataTypes.ENUM('csh', 'blackbaud', 'hogs', 'ehouse', 'sse', 'arthouse', 'rit', 'streamer', 'other'),
    allowNull: false,
  },
  twitchChannel: {
    type: DataTypes.STRING,
  },
});

module.exports = Player;

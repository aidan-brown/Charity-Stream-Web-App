import { DataTypes, Model, Optional } from 'sequelize';
import sequelizeConnection from '../config';

export enum Association {
  CSH = 'CSH',
  BLACKBAUD = 'BLACKBAUD',
  HOGS = 'HOGS',
  EHOUSE = 'EHOUSE',
  SSE = 'SSE',
  ARTHOUSE = 'ARTHOUSE',
  IHOUSE = 'IHOUSE',
  PEPBAND = 'PEPBAND',
  RIT = 'RIT',
  STREAMER = 'STREAMER',
  OTHER = 'OTHER'
}

export enum ChannelType {
  TWITCH = 'TWITCH',
  YOUTUBE = 'YOUTUBE'
}

interface PlayerAttributes {
  username: string
  name: string
  association: Association
  channel?: string
  channelType?: ChannelType
  teamSkyWars?: string
  teamBedWars?: string
}

export interface PlayerInput extends Optional<PlayerAttributes, 'username' | 'name' | 'association'> {}

class Player extends Model<PlayerAttributes, PlayerInput> implements PlayerAttributes {
  declare username: string;
  declare name: string;
  declare association: Association;
  declare channel?: string;
  declare channelType?: ChannelType;
  declare teamSkyWars?: string;
  declare teamBedWars?: string;
}

Player.init({
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  association: {
    type: DataTypes.ENUM(
      Association.ARTHOUSE,
      Association.BLACKBAUD,
      Association.CSH,
      Association.EHOUSE,
      Association.HOGS,
      Association.IHOUSE,
      Association.OTHER,
      Association.PEPBAND,
      Association.RIT,
      Association.SSE,
      Association.STREAMER
    ),
    allowNull: false
  },
  channel: {
    type: DataTypes.STRING
  },
  channelType: {
    type: DataTypes.ENUM(
      ChannelType.TWITCH,
      ChannelType.YOUTUBE
    )
  },
  teamSkyWars: {
    type: DataTypes.STRING
  },
  teamBedWars: {
    type: DataTypes.STRING
  }
}, {
  sequelize: sequelizeConnection
});

export default Player;

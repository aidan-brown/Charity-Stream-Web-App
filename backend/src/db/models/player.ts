import { DataTypes, Model, Optional } from 'sequelize'
import sequelizeConnection from '..'

export enum Association {
  CSH,
  BLACKBAUD,
  HOGS,
  EHOUSE,
  SSE,
  ARTHOUSE,
  IHOUSE,
  PEPBAND,
  RIT,
  STREAMER,
  OTHER
}

export enum ChannelType {
  TWITCH,
  YOUTUBE
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
  declare username: string
  declare name: string
  declare association: Association
  declare channel?: string
  declare channelType?: ChannelType
  declare teamSkyWars?: string
  declare teamBedWars?: string
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
      Association.ARTHOUSE.toString(),
      Association.BLACKBAUD.toString(),
      Association.CSH.toString(),
      Association.EHOUSE.toString(),
      Association.HOGS.toString(),
      Association.IHOUSE.toString(),
      Association.OTHER.toString(),
      Association.PEPBAND.toString(),
      Association.RIT.toString(),
      Association.SSE.toString(),
      Association.STREAMER.toString()
    ),
    allowNull: false
  },
  channel: {
    type: DataTypes.STRING
  },
  channelType: {
    type: DataTypes.ENUM(
      ChannelType.TWITCH.toString(),
      ChannelType.YOUTUBE.toString()
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
})

export default Player

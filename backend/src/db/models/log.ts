import { Optional, DataTypes, Model } from 'sequelize'
import sequelizeConnection from '../config'

export enum LogType {
  ERROR = 'ERROR',
  INFO = 'INFO',
  WARN = 'WARN',
  LOG = 'LOG'
}

interface LogAttributes {
  id: number
  message: string
  code: string
  type: LogType
  additional?: string
}

export interface LogInput extends Optional<LogAttributes, 'id' | 'message' | 'code' | 'type'> {}

export class Log extends Model<LogAttributes, LogInput> implements LogAttributes {
  declare id: number
  declare message: string
  declare code: string
  declare type: LogType
  declare additional?: string
}

Log.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM(
      LogType.ERROR,
      LogType.INFO,
      LogType.WARN
    ),
    allowNull: false
  },
  additional: {
    type: DataTypes.TEXT
  }
}, {
  sequelize: sequelizeConnection
})

export default Log

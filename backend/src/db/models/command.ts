import { DataTypes, Model, Optional } from 'sequelize'
import sequelizeConnection from '../config'

export enum Status {
  FINISHED = 'FINISHED',
  READY = 'READY',
  RUNNING = 'RUNNING',
  WAITING = 'WAITING',
}

interface CommandAttributes {
  id: number
  commandText: string
  cronId: (number | null)
  status?: Status
}

export interface CommandInput extends Optional<CommandAttributes, 'id' | 'commandText' | 'cronId'> {}

class Command extends Model<CommandAttributes, CommandInput> implements CommandAttributes {
  declare id: number
  declare commandText: string
  declare cronId: (number | null)
  declare status?: Status
}

Command.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  cronId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  commandText: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM(
      Status.FINISHED,
      Status.READY,
      Status.RUNNING,
      Status.WAITING
    ),
    defaultValue: Status.WAITING
  }
}, {
  sequelize: sequelizeConnection
})

export default Command

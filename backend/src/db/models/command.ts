import { DataTypes, Model, Optional } from 'sequelize'
import { sequelizeConnection } from '..'

export enum Status {
  FINISHED,
  READY,
  RUNNING,
  WAITING,
}

interface CommandAttributes {
  id: number
  commandText: string
  cronId: (number | null)
  status?: Status
}

export interface CommandInput extends Optional<CommandAttributes, 'id' | 'commandText' | 'cronId'> {}

export interface CommandOutput extends Required<CommandAttributes> {}

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
      Status.FINISHED.toString(),
      Status.READY.toString(),
      Status.RUNNING.toString(),
      Status.WAITING.toString()
    ),
    defaultValue: Status.WAITING.toString()
  }
}, {
  sequelize: sequelizeConnection
})

export default Command

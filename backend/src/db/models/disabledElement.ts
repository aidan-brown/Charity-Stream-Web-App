import { Model, DataTypes } from 'sequelize'
import { sequelizeConnection } from '..'

interface DisabledElementAttributes {
  id: string
  type: string
  disabled: boolean
}

export interface DisabledElementInput extends DisabledElementAttributes {}

export interface DisabledElementOutput extends Required<DisabledElementAttributes> {}

class DisabledElement extends Model<DisabledElementAttributes, DisabledElementInput> implements DisabledElementAttributes {
  declare id: string
  declare type: string
  declare disabled: boolean
}

DisabledElement.init({
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  disabled: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  }
}, {
  sequelize: sequelizeConnection
})

export default DisabledElement

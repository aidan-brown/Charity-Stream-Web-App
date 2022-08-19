import { DataTypes, Model, Optional } from 'sequelize'
import sequelizeConnection from '../config'

interface PriceOverrideAttributes {
  id: string
  type: string
  price: number
}

export interface PriceOverrideInput extends Optional<PriceOverrideAttributes, 'id' | 'type' | 'price'> {}

class PriceOverride extends Model<PriceOverrideAttributes, PriceOverrideInput> implements PriceOverrideAttributes {
  declare id: string
  declare type: string
  declare price: number
}

PriceOverride.init({
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
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
}, {
  sequelize: sequelizeConnection
})

export default PriceOverride

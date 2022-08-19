import { DataTypes, Model, Optional } from 'sequelize'
import { sequelizeConnection } from '..'
import Command from './command'

export enum Status {
  ACCEPTED,
  CANCELLED,
  PENDING,
}

interface CheckoutAttributes {
  status: string
  subTotal: number
  donationID?: string
}

export interface CheckoutInput extends Optional<CheckoutAttributes, 'status' | 'subTotal'> {}

export interface CheckoutOutput extends Required<CheckoutAttributes> {}

class Checkout extends Model<CheckoutAttributes, CheckoutInput> implements CheckoutAttributes {
  declare status: string
  declare subTotal: number
  declare donationID?: string
}

Checkout.init({
  donationID: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM(
      Status.ACCEPTED.toString(),
      Status.CANCELLED.toString(),
      Status.PENDING.toString()
    ),
    allowNull: false
  },
  subTotal: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
}, {
  sequelize: sequelizeConnection
})

Checkout.hasMany(Command)

export default Checkout

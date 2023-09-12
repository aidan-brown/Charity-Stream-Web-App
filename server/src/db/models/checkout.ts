import { DataTypes, Model, Optional } from 'sequelize';
import sequelizeConnection from '../config';

export enum Status {
  ACCEPTED = 'ACCEPTED',
  CANCELLED = 'CANCELLED',
  PENDING = 'PENDING',
}

interface CheckoutAttributes {
  status: string
  subTotal: number
  donationID?: string
}

export interface CheckoutInput extends Optional<CheckoutAttributes, 'status' | 'subTotal'> {}

class Checkout extends Model<CheckoutAttributes, CheckoutInput> implements CheckoutAttributes {
  declare status: string;
  declare subTotal: number;
  declare donationID?: string;
}

Checkout.init({
  donationID: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM(
      Status.ACCEPTED,
      Status.CANCELLED,
      Status.PENDING
    ),
    allowNull: false
  },
  subTotal: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
}, {
  sequelize: sequelizeConnection
});

export default Checkout;

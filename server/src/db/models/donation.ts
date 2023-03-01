import { DataTypes, Model, Optional } from 'sequelize';
import sequelizeConnection from '../config';

export enum Status {
  ACCEPTED = 'ACCEPTED',
  CANCELLED = 'CANCELLED',
  PENDING = 'PENDING',
}

interface DonationAttributes {
  subTotal: number
  id?: number
  status?: string
  total?: number
  donationId?: string
  accountId?: string
}

export interface DonationInput extends Optional<DonationAttributes, 'subTotal'> {}

class Donation extends Model<DonationAttributes, DonationInput> implements DonationAttributes {
  declare id?: number;
  declare subTotal: number;
  declare total?: number;
  declare status?: string;
  declare donationId?: string;
}

Donation.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  donationId: DataTypes.STRING,
  status: {
    type: DataTypes.ENUM(
      Status.ACCEPTED,
      Status.CANCELLED,
      Status.PENDING
    ),
    defaultValue: Status.PENDING
  },
  subTotal: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  total: DataTypes.FLOAT
}, {
  sequelize: sequelizeConnection
});

export default Donation;

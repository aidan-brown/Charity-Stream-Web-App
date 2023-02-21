import { DataTypes, Model, Optional } from 'sequelize';
import sequelizeConnection from '../config';

interface ItemAttributes {
  id: string
  type: string
  price: number
  defaultPrice: number
  disabled: boolean
}

export interface ItemInput extends Optional<ItemAttributes, 'id' | 'type' | 'price' | 'defaultPrice' | 'disabled'> {}

class Item extends Model<ItemAttributes, ItemInput> implements ItemAttributes {
  declare id: string;
  declare type: string;
  declare price: number;
  declare defaultPrice: number;
  declare disabled: boolean;
}

Item.init({
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
  },
  defaultPrice: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  disabled: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  }
}, {
  sequelize: sequelizeConnection
});

export default Item;

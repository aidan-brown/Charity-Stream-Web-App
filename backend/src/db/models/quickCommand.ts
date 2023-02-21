import { DataTypes, Model, Optional } from 'sequelize';
import sequelizeConnection from '../config';

interface QuickCommandAttributes {
  id: number
  variables: string
  commands: string
  name: string
  dataSource?: string
}

export interface QuickCommandInput extends Optional<QuickCommandAttributes, 'id' | 'variables' | 'commands' | 'name'> {}

class QuickCommand extends Model<QuickCommandAttributes, QuickCommandInput> implements QuickCommandAttributes {
  declare id: number;
  declare variables: string;
  declare commands: string;
  declare name: string;
  declare dataSource?: string;
}

QuickCommand.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  variables: {
    type: DataTypes.TEXT,
    defaultValue: '[]'
  },
  commands: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  dataSource: {
    type: DataTypes.TEXT
  }
}, {
  sequelize: sequelizeConnection
});

export default QuickCommand;

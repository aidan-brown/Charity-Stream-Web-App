import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'

dotenv.config()

const {
  DB_HOST: host,
  DB_NAME: database,
  DB_USERNAME: username,
  DB_PASSWORD: password
} = process.env

const sequelizeConnection = new Sequelize(
  database ?? 'mcsdb',
  username ?? 'root',
  password ?? 'password',
  {
    host,
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
      acquire: 60000
    },
    typeValidation: true,
    logging: false
  }
)

export default sequelizeConnection

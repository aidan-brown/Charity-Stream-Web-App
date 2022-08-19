import { Sequelize } from 'sequelize'
import { logger } from '../utils'
import dotenv from 'dotenv'
export * from './createTables'

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

export async function testConnection (): Promise<void> {
  try {
    await sequelizeConnection.authenticate()
  } catch (error) {
    void logger.error(
      'MYSQL_CONNECTION_ERROR',
      'Could not establish a connection with the MySQL server', {
        error
      }
    )
  }
}

export default sequelizeConnection

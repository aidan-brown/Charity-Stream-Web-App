import Sequelize from 'sequelize'
import { logger } from '../utils'

const {
  DB_HOST: host,
  DB_NAME: database,
  DB_USERNAME: username,
  DB_PASSWORD: password
} = process.env

export const sequelizeConnection = new Sequelize(
  database,
  username,
  password,
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
    logger.error('MYSQL_CONNECTION_ERROR', 'Could not establish a connection with the MySQL server', {
      error
    })
  }
}

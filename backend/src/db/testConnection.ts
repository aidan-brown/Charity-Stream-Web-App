import { logger } from '../utils';
import sequelizeConnection from './config';

export async function testConnection (): Promise<void> {
  try {
    await sequelizeConnection.authenticate();
  } catch (error) {
    void logger.error(
      'MYSQL_CONNECTION_ERROR',
      'Could not establish a connection with the MySQL server', {
        error
      }
    );
  }
}

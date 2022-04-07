const Sequelize = require('sequelize');
const { logger } = require('../utils');

const getConnection = () => {
  const {
    MCHOST: host,
    MCDB: database,
    MCUSER: username,
    MCPWRD: password,
  } = process.env;

  return new Sequelize(
    database, username, password,
    {
      host,
      dialect: 'mysql',
      pool: {
        max: 5,
        min: 0,
        idle: 10000,
      },
      typeValidation: true,
      logging: false,
    },
  );
};

module.exports = {
  getConnection,
  testConnection: async () => {
    try {
      await getConnection().authenticate();
    } catch (error) {
      logger.error('MYSQL_CONNECTION_ERROR', 'Could not establish a connection with the MySQL server', {
        error,
      });
    }
  },
};

const Sequelize = require('sequelize');

const getConnection = () => {
  const {
    MCHOST: host,
    MCDB: database,
    MCUSER: username,
    MCPWRD: password,
  } = process.env;

  const connection = new Sequelize(
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
      logging: process.env.NODE_ENV !== 'production',
    },
  );

  return connection;
};

const testConnection = async () => {
  try {
    await getConnection().authenticate();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('There was an error connecting to the MySQL server');
    process.exit(1);
  }
};

module.exports = {
  getConnection,
  testConnection,
};

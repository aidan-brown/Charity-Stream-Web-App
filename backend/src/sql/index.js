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
    },
  );

  return connection;
};

const testConnection = async () => {
  try {
    await getConnection().authenticate();
  } catch (_) {
    process.exit(1);
  }
};

module.exports = {
  getConnection,
  testConnection,
};

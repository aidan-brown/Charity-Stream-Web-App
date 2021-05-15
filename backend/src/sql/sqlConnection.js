const mysql = require('mysql2');

module.exports = {
  SqlConnect: () => {
    const connection = mysql.createConnection({
      host: process.env.MCHOST,
      database: process.env.MCDB,
      user: process.env.MCUSER,
      password: process.env.MCPWRD,
    });

    try {
      connection.connect();
    } catch (err) {
      throw new Error(JSON.stringify({ code: 500, message: 'Could not connect to the DB' }));
    }

    return connection;
  },
};

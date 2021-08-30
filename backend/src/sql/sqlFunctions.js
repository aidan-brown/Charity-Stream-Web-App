const { SqlConnect } = require('./sqlConnection');

module.exports = {
  Select: async (custom = null, tableOne = null, where = null, orderBy = null, direction = 'ASC') => {
    try {
      const connection = SqlConnect();
      const query = `
        ${(custom) || `SELECT * FROM ${tableOne}`}\
        ${(where) ? `WHERE ${where}` : ''}\
        ${(orderBy) ? `ORDER BY ${orderBy} ${direction}` : ''}`;

      return new Promise((resolve, reject) => {
        connection.query(query, (error, result) => {
          connection.end();

          if (error) {
            reject(
              new Error(
                JSON.stringify({
                  code: 500,
                  message: error.message,
                }),
              ),
            );
          }
          else {
            resolve(result.map((value) => {
              const data = {};
              Object.keys(value).forEach((key) => {
                if (value[key] !== null) 
                  data[key] = value[key];
              });
              return data;
            }));
          }
        });
      });
    } catch (error) {
      throw new Error(
        JSON.stringify({
          code: 500,
          message: error,
        }),
      );
    }
  },
  Insert: (table, keys, values) => {
    try {
      const connection = SqlConnect();

      const query = `INSERT INTO ${table}\
          (${keys.join(',')})\
          VALUES ("${Object.values(values).join('","')}")`;

      return new Promise((success, failure) => {
        connection.query(
          query,
          (error) => {
            connection.end();

            if (error) {
              failure(
                new Error(
                  JSON.stringify({
                    code: error.code,
                    message: error.message,
                  }),
                ),
              );
            } else {
              success();
            }
          },
        );
      });
    } catch (error) {
      throw new Error(
        JSON.stringify({
          code: 500,
          message: error,
        }),
      );
    }
  },
  Update: (table, item, where) => {
    try {
      const connection = SqlConnect();

      const query = `UPDATE ${table} SET\
        ${Object.keys(item).map(key => `${key} = "${item[key]}"`).join(',')}\
        WHERE ${where}`;

      return new Promise((success, failure) => {
        connection.query(
          query,
          (error) => {
            connection.end();

            if (error) {
              failure(
                new Error(
                  JSON.stringify({
                    code: error.code,
                    message: error.message,
                  }),
                ),
              );
            } else {
              success();
            }
          },
        );
      });
    } catch (error) {
      console.log(error);
      throw new Error(
        JSON.stringify({
          code: 500,
          message: error,
        }),
      );
    }
  },
  Replace: (table, keys, values) => {
    try {
      const connection = SqlConnect();

      const query = `
        REPLACE INTO ${table}\
        (${keys.join(',')})\
        VALUES ("${Object.values(values).join('","')}")`;

      return new Promise((success, failure) => {
        connection.query(
          query,
          (error) => {
            connection.end();

            if (error) {
              failure(
                new Error(
                  JSON.stringify({
                    code: error.code,
                    message: error.message,
                  }),
                ),
              );
            } else {
              success();
            }
          },
        );
      });
    } catch (error) {
      throw new Error(
        JSON.stringify({
          code: 500,
          message: error,
        }),
      );
    }
  },
  Delete: (table, where) => {
    try {
      const connection = SqlConnect();

      const query = `
      DELETE FROM ${table} 
      WHERE ${where}`;

      return new Promise((success, failure) => {
        connection.query(
          query,
          (error) => {
            connection.end();

            if (error) {
              failure(
                new Error(
                  JSON.stringify({
                    code: error.code,
                    message: error.message,
                  }),
                ),
              );
            } else {
              success();
            }
          },
        );
      });
    } catch (error) {
      console.log(error);
      throw new Error(
        JSON.stringify({
          code: 500,
          message: error,
        }),
      );
    }
  },
};

/**
 * This is a helper function to check Basic auth credentials on a request
 * @param {*} authHeader The header that would contain the username and password
 * @returns object containing boolean if they are authenticated and which piece failed
 */
const basicAuth = (req, res, next) => {
  if (req.headers) {
    const { authorization: auth } = req.headers;

    if (auth && auth.indexOf('Basic ') !== -1) {
      /* eslint-disable new-cap */
      const [username, password] = new Buffer.from(auth.split(' ')[1], 'base64').toString().split(':');
      /* eslint-enable new-cap */

      if (username === process.env.username && password === process.env.password) return next();

      res.status(401).send('Incorrect Credentials.');
      return null;
    }
  }

  res.set('WWW-Authenticate', 'Basic realm="401"');
  res.status(401).send('Authentication not provided');
  return null;
};

module.exports = {
  basicAuth,
};

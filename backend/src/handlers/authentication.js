/**
 * This is a helper function to check Basic auth credentials on a request
 * @param {*} authHeader The header that would contain the username and password
 * @returns object containing boolean if they are authenticated and which piece failed
 */
const basicAuth = (res, req, next) => {
  if (!req.headers) {
    req.status(401).json({ message: 'Missing Auth Header' });
    return null;
  }

  // Make sure the auth header exists and is in proper format
  const { authorization: auth } = req.headers;

  if (!auth || auth.indexOf('Basic ') === -1) {
    req.status(401).json({ message: 'Missing Auth Header' });
    return null;
  }

  // Get the username and password

  /* eslint-disable new-cap */
  const [username, password] = new Buffer.from(auth.split(' ')[1], 'base64').toString().split(':');
  /* eslint-enable new-cap */

  if (username !== process.env.username || password !== process.env.password) { return res.status(401).json({ message: 'Invalid Credentials' }); }

  return next();
};

module.exports = {
  basicAuth,
};

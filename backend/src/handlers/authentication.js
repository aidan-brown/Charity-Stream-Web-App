/**
 * This is a helper function to check Basic auth credentials on a request
 * @param {*} authHeader The header that would contain the username and password
 * @returns object containing boolean if they are authenticated and which piece failed
 */
const basicAuth = (res, req, next) => {
  // Make sure the auth header exists and is in proper format
  const { authorization: auth } = req.headers;

  if (!auth || auth.indexOf('Basic ') === -1)
    return res.status(401).json({ message: 'Missing Auth Header' });

  // Get the username and password
  const [username, password] = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');

  if (username !== process.env.username || password !== process.env.password)
    return res.status(401).json({ message: 'Invalid Credentials' });

  return next();
}

module.exports = {
  basicAuth,
}

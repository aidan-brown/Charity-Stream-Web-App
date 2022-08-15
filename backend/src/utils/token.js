const jwt = require('jsonwebtoken');

const verifyToken = (token) => {
  const jwtToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
  const { exp } = jwtToken;

  if (((exp * 1000) - Date.now()) <= 0) {
    return false;
  }

  return true;
};

module.exports = verifyToken;

const jwt = require('jsonwebtoken');

module.exports = (req, res) => {
  const { tokens } = req.cookies;

  if (tokens) {
    const { refreshToken } = tokens;

    if (refreshToken) {
      try {
        const { id } = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY);

        const accessToken = jwt.sign(
          { id },
          process.env.JWT_SECRET_KEY,
          { expiresIn: '15m' },
        );

        return res
          .cookie('tokens', {
            accessToken,
            refreshToken,
          }, {
            secure: process.env.DEPLOYMENT_ENV === 'production',
            httpOnly: true,
          })
          .status(201)
          .send('Issued new token');
      } catch (err) {
        return res.status(400).send('Refresh token has expired');
      }
    }

    return res.status(400).send('Missing Refresh Token');
  }

  return res.status(401).send('User is not authenticated');
};

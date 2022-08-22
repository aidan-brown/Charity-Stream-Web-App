const jwt = require('jsonwebtoken');
const { Token } = require('../../sql/models');
const { verifyHash } = require('../../utils/crypto');

module.exports = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (refreshToken) {
    try {
      const jwtToken = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY);
      const { id, service } = jwtToken;

      const savedToken = await Token.findOne({
        where: {
          accountId: id,
        },
      });

      if (savedToken && verifyHash(refreshToken, savedToken.hash, savedToken.salt)) {
        const accessToken = jwt.sign(
          { id, service },
          process.env.JWT_SECRET_KEY,
          { expiresIn: '15m' },
        );

        return res
          .status(201)
          .send({ accessToken });
      }

      return res.status(400).send('Invalid Refresh token');
    } catch (err) {
      return res.status(400).send('Refresh token has expired');
    }
  }

  return res.status(400).send('Missing Refresh Token');
};

const jwt = require('jsonwebtoken');
const { Token } = require('../../sql/models');

module.exports = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (refreshToken) {
    try {
      const { id } = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY);

      const savedToken = await Token.findOne({
        where: {
          accountId: id,
        },
      });

      if (savedToken) {
        await savedToken.destroy();
      }

      return res
        .clearCookie('accessToken')
        .clearCookie('refreshToken')
        .status(200)
        .send('Successfully logged out');
    } catch (err) {
      return res.status(500).send('Something went wrong when trying to log you out');
    }
  }

  return res.status(401).send('User is not authenticated');
};

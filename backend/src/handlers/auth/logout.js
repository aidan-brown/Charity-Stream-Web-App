const jwt = require('jsonwebtoken');
const { Token } = require('../../sql/models');

module.exports = async (req, res) => {
  const { tokens } = req.cookies;

  if (tokens) {
    const { refreshToken } = tokens;

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
          .cookie('tokens', null, {
            secure: process.env.DEPLOYMENT_ENV === 'production',
            httpOnly: true,
            expires: new Date(Date.now() - 10000),
          })
          .status(200)
          .send('Successfully logged out');
      } catch (err) {
        return res.status(500).send('Something went wrong when trying to log you out');
      }
    }

    return res.status(400).send('');
  }

  return res.status(401).send('User is not authenticated');
};

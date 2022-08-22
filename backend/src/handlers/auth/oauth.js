const jwt = require('jsonwebtoken');
const { Token, Account } = require('../../sql/models');
const { hashValue } = require('../../utils/crypto');
const services = require('./services');

module.exports = async (req, res) => {
  const { token } = req.body;
  const { oauthService } = req.params;

  let user;
  try {
    switch (oauthService) {
      case 'google':
        user = await services.google(token);
        break;
      case 'twitch':
        user = await services.twitch(token);
        break;
      case 'microsoft':
        user = await services.microsoft(token);
        break;
      default:
        throw new Error(`${oauthService} is not a valid service`);
    }

    const { id, service } = user;

    // Find or create user
    const [account] = await Account.findOrCreate({
      where: { id, service },
      defaults: user,
    });

    // Token for accessing sensitive data
    const accessToken = jwt.sign(
      { id, service },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '15m' },
    );

    // Token for getting new tokens
    const refreshToken = jwt.sign(
      { id, service },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '7d' },
    );

    const { hash, salt } = hashValue(refreshToken);

    // If the token exists, overwrite with the new one
    if (await Token.findOne({ where: { accountId: id } })) {
      await Token.update({
        hash,
        salt,
      }, {
        where: {
          accountId: id,
        },
      });
    } else {
      await Token.create({
        accountId: id,
        hash,
        salt,
      });
    }

    // Add the token to an http only cookie and send back account
    res
      .cookie('refreshToken', refreshToken, {
        secure: process.env.DEPLOYMENT_ENV === 'production',
        httpOnly: true,
      })
      .status(201)
      .send({ account, accessToken });
  } catch (err) {
    res.status(400).send('Bad Request');
  }
};

const { default: axios } = require('axios');
const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');
const { Token, Account } = require('../../sql/models');
const { hashValue } = require('../../utils/crypto');

const GOOGLE_USER_URL = 'https://www.googleapis.com/oauth2/v2/userinfo';

module.exports = async (req, res) => {
  const { token } = req.body;

  try {
    // Get user account using access token from Google
    const { data: googleUser } = await axios.get(`${GOOGLE_USER_URL}?access_token=${token}`);
    const {
      id,
      name,
      picture,
      locale,
      email,
    } = googleUser;

    const newUser = {
      id,
      name,
      picture,
      locale,
      email,
    };

    // Find or create user
    const [account] = await Account.findOrCreate({
      where: { id },
      defaults: newUser,
    });

    const accessExpires = dayjs().set('minutes', 15).second();
    const refreshExpires = dayjs().set('day', 7).second();

    // Token for accessing sensitive data
    const accessToken = jwt.sign(
      { id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '15m' },
    );

    // Token for getting new tokens
    const refreshToken = jwt.sign(
      { id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '7d' },
    );

    const { hash, salt } = hashValue(refreshToken);

    // If the token exists, overwrite with the new one
    if (await Token.findOne({ where: { accountId: id } })) {
      await Token.update({
        hash,
        salt,
        expires: refreshExpires,
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
        expires: refreshExpires,
      });
    }

    // Add the token to an http only cookie and send back account
    res
      .cookie('tokens', {
        accessToken,
        refreshToken,
      }, {
        secure: process.env.DEPLOYMENT_ENV === 'production',
        httpOnly: true,
      })
      .status(201)
      .send({ account, expires: accessExpires });
  } catch (err) {
    res.status(400).send('Bad Request');
  }
};

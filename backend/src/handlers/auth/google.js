const { default: axios } = require('axios');
const jwt = require('jsonwebtoken');
const { Token, Account } = require('../../sql/models');

const GOOGLE_USER_URL = 'https://www.googleapis.com/oauth2/v2/userinfo';

module.exports = async (req, res) => {
  const { token } = req.body;

  try {
    // Get user account using access token from Google
    const { data: googleUser } = await axios.get(`${GOOGLE_USER_URL}?access_token=${token}`);
    const {
      id, email, name, picture, locale,
    } = googleUser;
    const newUser = {
      id, email, name, picture, locale,
    };

    // Find or create user
    const [account] = await Account.findOrCreate({
      where: { id: googleUser.id },
      defaults: newUser,
    });

    // Token for accessing sensitive data
    const accessToken = jwt.sign(
      { id: account.id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '15m' },
    );

    // Token for getting new tokens
    const refreshToken = jwt.sign(
      { id: account.id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '7d' },
    );

    // Add the tokens to the table
    await Token.update({
      accessToken,
      refreshToken,
    }, {
      where: {
        id: account.id,
      },
    });

    // Add the token to an http only cookie and the user to a readable cookie
    res
      .cookie('tokens', {
        accessToken,
        refreshToken,
      }, {
        secure: process.env.DEPLOYMENT_ENV === 'production',
        httpOnly: true,
      })
      .status(201)
      .send({ account });
  } catch (err) {
    res.status(400).send('Bad Request');
  }
};

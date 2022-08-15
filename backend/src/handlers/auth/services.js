const { default: axios } = require('axios');

const GOOGLE_URL = 'https://www.googleapis.com/oauth2/v2/userinfo';
const TWITCH_URL = 'https://api.twitch.tv/helix/users';
const MICROSOFT_URL = 'https://graph.microsoft.com/v1.0/me';

module.exports = {
  google: async (token) => {
    const { data: googleUser } = await axios.get(`${GOOGLE_URL}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const {
      id,
      name,
      picture,
      locale,
      email,
    } = googleUser;

    return {
      id,
      name,
      picture,
      locale,
      email,
      service: 'GOOGLE',
    };
  },
  twitch: async (token) => {
    const { data: { data } } = await axios.get(TWITCH_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Client-Id': process.env.TWITCH_AUTH_CLIENT_ID,
      },
    });
    const [twitchUser] = data;

    const {
      id,
      display_name: name,
      profile_image_url: picture,
      locale = 'en',
      email,
    } = twitchUser;

    return {
      id,
      name,
      picture,
      locale,
      email,
      service: 'TWITCH',
    };
  },
  microsoft: async (token) => {
    const { data: microsoftUser } = await axios.get(MICROSOFT_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const {
      id,
      displayName: name,
      locale = 'en',
      mail: email,
    } = microsoftUser;

    return {
      id,
      name,
      locale,
      email,
      service: 'MICROSOFT',
    };
  },
};

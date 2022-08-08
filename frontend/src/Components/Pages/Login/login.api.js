const { postReq, getUrl } = require('../../../Utils');

export const postToken = async (token) => {
  const response = await postReq(`${getUrl()}/google/auth`, JSON.stringify({ token }));

  if (response.status === 200) {
    const { token: jwtToken, user } = await response.json();

    return { jwtToken, user };
  }

  return null;
};

export const refreshToken = async (token) => {
  const response = await postReq(`${getUrl()}/token/refresh`, JSON.stringify({ token }));

  if (response.status === 200) {
    const { token: jwtToken } = await response.json();
    return jwtToken;
  }

  return null;
};

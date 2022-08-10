const { getUrl, postReq } = require('../Utils');

export const refreshToken = async () => {
  const response = await postReq(`${getUrl()}/token/refresh`);

  if (response.status === 201) {
    return true;
  }

  return false;
};

export const postToken = async (token) => {
  const response = await postReq(`${getUrl()}/google/auth`, JSON.stringify({ token }));

  if (response.status === 200) {
    const { token: jwtToken, user } = await response.json();

    return { jwtToken, user };
  }

  return null;
};

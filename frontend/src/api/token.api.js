const { getUrl, getReq } = require('../Utils');

const refreshToken = async () => {
  const response = await getReq(`${getUrl()}/token/refresh`);

  if (response.status === 201) {
    return true;
  }

  return false;
};

export default refreshToken;

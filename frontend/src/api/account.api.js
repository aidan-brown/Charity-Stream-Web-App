const { getUrl, getReq } = require('../Utils');

const getAccount = async () => {
  const response = await getReq(`${getUrl()}/account`);

  if (response.status === 200) {
    const account = await response.json();
    return account;
  }

  return null;
};

export default getAccount;

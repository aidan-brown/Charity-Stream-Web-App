import { API_DEV_URL, API_LOCAL_URL, API_PROD_URL } from '../constants';

export default () => {
  switch (process.env.DEPLOYMENT_ENV) {
    case 'production': return API_PROD_URL;
    case 'develop': return API_DEV_URL;
    default: return API_LOCAL_URL;
  }
};

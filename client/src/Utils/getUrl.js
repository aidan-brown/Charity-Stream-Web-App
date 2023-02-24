import { DEV_URL, LOCAL_URL, PROD_URL } from '../constants';

export default () => {
  switch (process.env.DEPLOYMENT_ENV) {
    case 'production': return PROD_URL;
    case 'develop': return DEV_URL;
    default: return LOCAL_URL;
  }
};

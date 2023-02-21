import {
  PROD_URL,
  DEV_URL,
  LOCAL_URL
} from '../constants';

export default function getUrl (): string {
  switch (process.env.DEPLOYMENT_ENV) {
    case 'production': return PROD_URL;
    case 'develop': return DEV_URL;
    case 'local': return LOCAL_URL;
    default: return DEV_URL;
  }
}

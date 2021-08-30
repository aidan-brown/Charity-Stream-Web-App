// import { BACKENDURL } from '../Components/App/constants';

export default () => (
  process.env.environment === 'local'
    ? 'http://localhost:8000'
    : 'http://localhost:8000');

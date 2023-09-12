export default () => {
  if (process.env.REACT_APP_ENVIRONMENT === 'development' || process.env.REACT_APP_ENVIRONMENT === 'production') {
    return '/api';
  }

  return 'http://localhost:8080/api';
};

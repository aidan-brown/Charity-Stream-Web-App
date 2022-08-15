import { refreshToken } from '../api/token.api';

export const verifyToken = async () => {
  // Grab the expire time from local storage TODO: Eventually make this baked into the cookie
  const expires = Number(localStorage.getItem('mcs-auth-expires') || 0);

  if (expires) {
    console.log(`Is expired? : ${expires < Date.now()}`);

    if (expires > Date.now()) {
      console.log(`Found expiry: ${expires}`);
      console.log(`Time until expired: ${expires - Date.now()}`);
      return;
    }
  }

  if (await refreshToken()) {
    return;
  }

  console.log('token expired redirecting to login');
  // If that does not work, we have to redirect
  throw new Error('REDIRECT_TO_LOGIN');
};

export default verifyToken;

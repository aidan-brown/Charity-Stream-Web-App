import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';
import { getApiUrl } from '../Utils';

const refreshToken = async () => {
  const response = await fetch(`${getApiUrl()}/token/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (response.status === 201) {
    return true;
  }

  return false;
};

export const verifyToken = async () => {
  const token = Cookies.get('accessToken');
  const expires = jwtDecode(token)?.exp;

  if (expires > (new Date() / 1000)) {
    return token;
  }

  if (await refreshToken()) {
    return Cookies.get('accessToken');
  }

  // If that does not work, we have to redirect
  throw new Error('REDIRECT_TO_LOGIN');
};

export const postToken = async ({
  token = undefined,
  service = 'google',
}) => {
  const response = await fetch(`${getApiUrl()}/${service}/auth`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ token }),
  });

  if (response.status === 201) {
    return response.json();
  }

  throw new Error('There was a problem logging you in');
};

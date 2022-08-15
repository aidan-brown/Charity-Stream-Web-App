import getUrl from '../Utils/getUrl';
import { verifyToken } from './token.api';

const requestBuilder = (method) => async (route, shouldAuth = false, body = undefined) => {
  if (shouldAuth) {
    await verifyToken();
  }

  const response = await fetch(`${getUrl()}${route}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(shouldAuth && { credentials: 'include' }),
    ...(body && { body: JSON.stringify(body) }),
  });

  if (response.status < 400) {
    return response.json();
  }

  throw new Error(await response.text());
};

export const Get = requestBuilder('GET');
export const Post = requestBuilder('POST');
export const Put = requestBuilder('PUT');
export const Delete = requestBuilder('DELETE');

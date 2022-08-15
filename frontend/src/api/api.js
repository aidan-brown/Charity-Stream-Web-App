import getUrl from '../Utils/getUrl';
import { verifyToken } from './token.api';

const requestBuilder = (method) => async ({
  route,
  shouldAuth = false,
  body = undefined,
  toJson = true,
}) => {
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
    if (toJson) {
      return response.json();
    }
    return response;
  }

  throw new Error(JSON.stringify(await response.json()));
};

export const Get = requestBuilder('GET');
export const Post = requestBuilder('POST');
export const Put = requestBuilder('PUT');
export const Delete = requestBuilder('DELETE');

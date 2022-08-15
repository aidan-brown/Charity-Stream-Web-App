import getUrl from '../Utils/getUrl';
import { verifyToken } from './token.api';

const requestBuilder = (method) => async ({
  route,
  body = undefined,
  shouldAuth = false,
  toJson = true,
}) => {
  let token;

  if (shouldAuth) {
    token = await verifyToken();
  }

  const response = await fetch(`${getUrl()}${route}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
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

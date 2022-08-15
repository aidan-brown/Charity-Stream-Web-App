import verifyToken from './verifyToken';

export const postReq = (url, body = undefined, shouldAuth = false) => {
  const request = () => fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body,
  });

  return shouldAuth
    ? verifyToken().then(() => request())
    : request();
};

export const putReq = (url, body = undefined, shouldAuth = false) => {
  const request = () => fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body,
  });

  return shouldAuth
    ? verifyToken().then(() => request())
    : request();
};

export const getReq = (url, shouldAuth = false) => {
  const request = () => fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  return shouldAuth
    ? verifyToken().then(() => request())
    : request();
};

export const deleteReq = (url, shouldAuth = false) => {
  const request = () => fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  return shouldAuth
    ? verifyToken().then(() => request())
    : request();
};

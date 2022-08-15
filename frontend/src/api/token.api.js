import getUrl from '../Utils/getUrl';

export const refreshToken = async () => {
  const response = await fetch(`${getUrl()}/token/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (response.status === 201) {
    const { expires } = await response.json();
    localStorage.setItem('mcs-auth-expires', expires);

    return true;
  }

  return false;
};

export const postToken = async (token, service = 'google') => {
  const response = await fetch(`${getUrl()}/${service}/auth`, {
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

export const verifyToken = async () => {
  // Grab the expire time from local storage TODO: Eventually make this baked into the cookie
  const expires = Number(localStorage.getItem('mcs-auth-expires') || 0);

  if (expires && expires > Date.now()) {
    return;
  }

  if (await refreshToken()) {
    return;
  }

  // If that does not work, we have to redirect
  throw new Error('REDIRECT_TO_LOGIN');
};

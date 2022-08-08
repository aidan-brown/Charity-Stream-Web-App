export const postReq = (url, body = {}) => fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
  body,
});

export const putReq = (url, body = {}) => fetch(url, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
  body,
});

export const getReq = (url) => fetch(url, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
});

export const deleteReq = (url) => fetch(url, {
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
});

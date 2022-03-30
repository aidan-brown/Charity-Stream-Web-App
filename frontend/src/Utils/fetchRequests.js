const postReq = (url, body = {}) => fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body,
});

const putReq = (url, body = {}) => fetch(url, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body,
});

const getReq = (url) => fetch(url, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
});

export { postReq, getReq, putReq };

const postReq = (url, body={}) => {
    return fetch(url,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: body
    });
}

const putReq = (url, body={}) => {
    return fetch(url,{
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: body
    });
}

const getReq = (url) => {
    return fetch(url,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

export {postReq, getReq, putReq};
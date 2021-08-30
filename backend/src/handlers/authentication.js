const isAuthenticated = authHeader => {
  const [username, password] = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');

  if (username !== process.env.username) {
    return {
      isAuthenticated: false,
      error: 'Username does not match',
    }
  }

  if (password !== process.env.password) {
    return {
      isAuthenticated: false,
      error: 'Password does not match',
    }
  }

  return { isAuthenticated: true }
}

module.exports = {
  isAuthenticated,
}
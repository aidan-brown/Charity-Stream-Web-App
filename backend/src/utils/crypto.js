const crypto = require('crypto');

const hashValue = (input) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(input, salt, 1000, 64, 'sha512').toString('hex');

  return {
    salt,
    hash,
  };
};

const verifyHash = (input, expected, salt) => expected === crypto.pbkdf2Sync(input, salt, 1000, 64, 'sha512').toString('hex');

module.exports = {
  hashValue,
  verifyHash,
};

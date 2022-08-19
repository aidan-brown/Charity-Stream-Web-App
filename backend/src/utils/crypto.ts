import crypto = require('crypto')

interface SaltHash {
  salt: string
  hash: string
}

export function hashValue (input: string): SaltHash {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.pbkdf2Sync(input, salt, 1000, 64, 'sha512').toString('hex')

  return {
    salt,
    hash
  }
}

export function verifyHash (input: string, expected: string, salt: string): boolean {
  return expected === crypto.pbkdf2Sync(input, salt, 1000, 64, 'sha512').toString('hex')
}

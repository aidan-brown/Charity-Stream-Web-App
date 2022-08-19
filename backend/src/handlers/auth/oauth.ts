import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import Account, { AccountInput } from '../../db/models/account'
import Token from '../../db/models/token'
import { hashValue } from '../../utils/crypto'
import { google, twitch, microsoft } from './services'

export default async function oauth (req: Request, res: Response): Promise<void> {
  const { token } = req.body
  const { oauthService } = req.params

  let user: AccountInput
  try {
    switch (oauthService) {
      case 'google':
        user = await google(token)
        break
      case 'twitch':
        user = await twitch(token)
        break
      case 'microsoft':
        user = await microsoft(token)
        break
      default:
        throw new Error(`${oauthService} is not a valid service`)
    }

    const { id, service } = user

    // Find or create user
    const [account] = await Account.findOrCreate({
      where: { id, service },
      defaults: user
    })

    // Token for accessing sensitive data
    const accessToken = jwt.sign(
      { id, service },
      process.env.JWT_SECRET_KEY ?? 'secret',
      { expiresIn: '15m' }
    )

    // Token for getting new tokens
    const refreshToken = jwt.sign(
      { id, service },
      process.env.JWT_SECRET_KEY ?? 'secret',
      { expiresIn: '7d' }
    )

    const { hash, salt } = hashValue(refreshToken)

    // If the token exists, overwrite with the new one
    if ((await Token.findOne({ where: { accountId: id } })) != null) {
      await Token.update({
        hash,
        salt
      }, {
        where: {
          accountId: id
        }
      })
    } else {
      await Token.create({
        accountId: id,
        hash,
        salt
      })
    }

    // Add the token to an http only cookie and send back account
    res
      .cookie('accessToken', accessToken)
      .cookie('refreshToken', refreshToken, {
        secure: process.env.DEPLOYMENT_ENV === 'production',
        httpOnly: true
      })
      .status(201)
      .send({ account })
  } catch (err) {
    res.status(400).send('Bad Request')
  }
}

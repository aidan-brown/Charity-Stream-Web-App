import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import Token from '../../db/models/token'
import { JWTUser } from '../../utils/passportConfig'

export default async function logout (req: Request, res: Response): Promise<void> {
  const { refreshToken = '' } = req.cookies

  if (refreshToken !== '') {
    try {
      const { id } = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY ?? 'secret') as JWTUser

      const savedToken = await Token.findOne({
        where: {
          accountId: id
        }
      })

      if (savedToken != null) {
        await savedToken.destroy()
      }

      res
        .clearCookie('accessToken')
        .clearCookie('refreshToken')
        .status(200)
        .send('Successfully logged out')
    } catch (err) {
      res.status(500).send('Something went wrong when trying to log you out')
    }
  }

  res.status(401).send('User is not authenticated')
}

import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Token from '../../db/models/token';
import { verifyHash } from '../../utils/crypto';
import { JWTUser } from '../../utils/passportConfig';

export default async function tokenRefresh (req: Request, res: Response): Promise<Response> {
  const { refreshToken = '' } = req.cookies;

  if (refreshToken !== '') {
    try {
      const jwtToken = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY ?? 'secret') as JWTUser;
      const { id, service } = jwtToken;

      const savedToken = await Token.findOne({
        where: {
          accountId: id
        }
      });

      if ((savedToken != null) && verifyHash(refreshToken, savedToken.hash, savedToken.salt)) {
        const accessToken = jwt.sign(
          { id, service },
          process.env.JWT_SECRET_KEY ?? 'secret',
          { expiresIn: '15m' }
        );

        return res
          .cookie('accessToken', accessToken)
          .status(201)
          .send('Success');
      }

      return res.status(400).send('Invalid Refresh token');
    } catch (err) {
      return res.status(400).send('Refresh token has expired');
    }
  }

  return res.status(400).send('Missing Refresh Token');
}

import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export default async function jwtMiddleware (req: Request, res: Response): Promise<void> {
  const { user = {} } = req;

  const token = jwt.sign(
    { user },
    process.env.JWT_SECRET_KEY ?? 'secret',
    { expiresIn: '1d' }
  );

  // Add the token to an http only cookie and send back account
  res
    .cookie('token', token, {
      secure: process.env.NODE_ENV !== 'local',
      httpOnly: true
    })
    .status(308)
    .redirect('/');
}

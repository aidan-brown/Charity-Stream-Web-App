import { Request, Response } from 'express';

export default async function logout (req: Request, res: Response): Promise<void> {
  const { token } = req.cookies;

  if (token !== '') {
    res
      .clearCookie('token')
      .status(200)
      .send('Successfully logged out');
  } else {
    res.status(401).send('User is not authenticated');
  }
}

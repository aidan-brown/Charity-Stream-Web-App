import { Request, Response } from 'express';
import Account from '../../db/models/account';
import { JWTUser } from '../../utils/passportConfig';

export default async function getAccount (req: Request, res: Response): Promise<Response> {
  const { user = {} } = req;

  try {
    const { id, service } = user as JWTUser;
    const account = await Account.findOne({
      where: { id, service }
    });

    if (account != null) {
      return res.status(200).send(account);
    }

    return res.status(404).send('Account not found');
  } catch (err) {
    return res.status(500).send('Internal Server Error');
  }
}

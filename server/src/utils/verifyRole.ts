import { Request, Response, NextFunction } from 'express';
import Account, { Role } from '../db/models/account';
import { JWTUser } from '../config/passportSetup';

export default function verifyRole (...roles: Role[]) {
  return async function (req: Request, res: Response, next: NextFunction) {
    const { user } = req;

    if (user != null) {
      const { id, service } = user as JWTUser;
      const account = await Account.findOne({ where: { id, service } });

      if (account?.role !== undefined) {
        if (roles.includes(account.role)) {
          return next();
        }
      }
    }

    return res.status(401).send('Unauthorized');
  };
}

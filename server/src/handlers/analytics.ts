import { Request, Response } from 'express';
import { Op } from 'sequelize';
import Log from '../db/models/log';

interface queryParams {
  code: string
  message: string
  type: string
  additional: string
}

export default async function getAnalytics (req: Request, res: Response): Promise<Response> {
  const {
    code = '',
    message = '',
    type = '',
    additional = ''
  } = req.query as unknown as queryParams;

  try {
    const logs = await Log.findAll({
      where: {
        ...(additional !== '' && {
          additional: {
            [Op.like]: `%${additional}%`
          }
        }),
        ...(type !== '' && {
          type
        }),
        ...(message !== '' && {
          message: {
            [Op.like]: `%${message}%`
          }
        }),
        ...(code !== '' && {
          code
        })
      }
    });

    return res.status(200).send(logs);
  } catch (error) {
    return res.status(500).send('Something went wrong when getting those logs');
  }
}

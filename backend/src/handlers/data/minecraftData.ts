import { Request, Response } from 'express';
import { Item } from '../../db/models';
import { all, allFlat } from '../../minecraftData';
import { logger } from '../../utils';

interface ExtraData {
  price: number
  defaultPrice: number
  disabled: boolean
};

export default async function getMinecraftData (req: Request, res: Response): Promise<Response> {
  const { type = null } = req.query;

  try {
    let data = allFlat;

    if (type !== null) {
      if (!all.has(type as string)) {
        throw new Error(`${type as string} is not a valid type`);
      }

      data = all.get(type as string) ?? new Map();
    }

    const extraData = new Map<string, ExtraData>();

    const items = await Item.findAll({
      ...(type !== null && {
        where: {
          type: type as string
        }
      })
    });

    items.forEach(({ id, price, defaultPrice, disabled, type }) => {
      extraData.set(`${type}_${id}`, {
        price,
        defaultPrice,
        disabled
      });
    });

    return res.status(200).send({
      data: Array.from(data).map(([key, value]) => {
        return {
          ...value,
          ...extraData.get(`${value.type}_${key}`)
        };
      })
    });
  } catch (error) {
    void logger.log(
      'GET_DISABLED_ITEMS_FAILED',
      'Failed to get disabled items', {
        error
      }
    );

    return res.status(500).send({ errors: ['Could not find disabled items'] });
  }
}

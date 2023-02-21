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
  const { filterTag = 'ALL' } = req.query;

  try {
    let data = allFlat;

    if (filterTag !== null && filterTag !== 'ALL') {
      if (!all.has(filterTag as string)) {
        throw new Error(`${filterTag as string} is not a valid type`);
      }

      data = all.get(filterTag as string) ?? new Map();
    }

    const extraData = new Map<string, ExtraData>();

    const items = await Item.findAll({
      ...(filterTag !== null && {
        where: {
          type: (filterTag as string).toLowerCase()
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
      data: Array.from(data)
        .map(
          ([key, value]) => ({
            ...value,
            ...extraData.get(`${value.type}_${key}`)
          })
        )
        .sort(({ disabled: d1 = false }, { disabled: d2 = false }) => {
          if (d1 && d2) return 0;
          if (d1) return -1;
          return 1;
        })
    });
  } catch (error) {
    void logger.log(
      'GET_DISABLED_ITEMS_FAILED',
      'Failed to get disabled items', {
        error
      }
    );

    return res.status(400).send({ errors: ['There was an error getting the items'] });
  }
}

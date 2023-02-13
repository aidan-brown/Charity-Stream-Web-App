import { Request, Response } from 'express';
import Item, { ItemInput } from '../../db/models/item';
import { logger } from '../../utils';

export async function getItems (_: Request, res: Response): Promise<Response> {
  try {
    const items = await Item.findAll();

    return res.status(200).send(items);
  } catch (error) {
    void logger.log(
      'GET_ITEMS_ERROR',
      'Error getting the items', {
        error
      }
    );

    return res.status(500).send('Something went wrong when trying to get the price overrides');
  }
}

export async function updateItems (req: Request, res: Response): Promise<Response> {
  const updates: ItemInput[] = req.body;

  const errors = [] as string[];
  await Promise.all(updates.map(async (update) => {
    const { id = '', type } = update;

    try {
      await Item.update(update, { where: { id, type } });
    } catch (error) {
      errors.push(error as string);
    }
  }));

  if (errors.length > 0) {
    void logger.log(
      'ITEM_UPDATE_ERROR',
      'Error Updating those items', {
        errors
      }
    );

    return res.status(400).send({ errors });
  }

  return res.status(201).send({ message: 'Successfully updated those items' });
}

import { Request, Response } from 'express';
import DisabledElement, { DisabledElementInput } from '../db/models/disabledElement';
import { logger } from '../utils';

export async function getCheckoutStatus (_: Request, res: Response): Promise<Response> {
  try {
    const { disabled } = await DisabledElement.findOne({
      where: {
        id: 'checkout-disable',
        type: 'checkout'
      }
    }) ?? {};

    return res.status(200).send(!!(disabled ?? false));
  } catch (error) {
    void logger.error(
      'GET_CHECKOUT_FAILED',
      'Something went wrong trying to get checkout status', {
        error
      }
    );

    return res.status(500).send('Something went wrong when trying to get checkout');
  }
}

export async function disableCheckout (req: Request, res: Response): Promise<Response> {
  const { status } = req.body;

  if (status !== true && status !== false) {
    return res.status(400).send('Status must be true or false');
  }

  try {
    const checkout = await DisabledElement.findOne({
      where: {
        id: 'checkout-disable',
        type: 'checkout'
      }
    });

    if (checkout != null) {
      await DisabledElement.update(
        {
          disabled: status
        },
        {
          where: {
            id: 'checkout-disable',
            type: 'checkout'
          }
        }
      );
    } else {
      await DisabledElement.create({
        id: 'checkout-disable',
        disabled: status,
        type: 'checkout'
      });
    }

    void logger.info(
      'CHECKOUT_TOGGLE',
      'Successfully toggled checkout', {
        status
      }
    );

    return res.status(200).send('Successfully toggled checkout');
  } catch (error) {
    void logger.error(
      'TOGGLE_CHECKOUT_FAILED',
      'Failed to toggle checkout', {
        error
      }
    );

    return res.status(500).send('Something went wrong when toggling checkout');
  }
}
export async function disableElements (req: Request, res: Response): Promise<Response> {
  const elements = req.body as DisabledElementInput[];

  try {
    await Promise.all(elements.map(async ({ id, disabled, type }) => {
      const foundItem = await DisabledElement.findOne({ where: { id, type } });

      if (foundItem == null) await DisabledElement.create({ id, disabled, type });
      else {
        await DisabledElement.destroy({ where: { id, type } });
      }
    }));

    void logger.info(
      'DISABLED_ELEMENTS',
      'Successfully disabled elements'
    );

    return res.send('Success').status(200);
  } catch (error) {
    void logger.error(
      'TOGGLE_ELEMENTS_FAILED',
      'Failed to toggle elements', {
        error
      }
    );

    return res.status(500).send('Failed to update elements');
  }
}

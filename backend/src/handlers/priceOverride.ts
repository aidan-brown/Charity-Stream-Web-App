import { Request, Response } from 'express'
import PriceOverride, { PriceOverrideInput } from '../db/models/priceOverride'
import { logger } from '../utils'

export async function getPriceOverrides (_: Request, res: Response): Promise<Response> {
  try {
    const priceOverrides = await PriceOverride.findAll()

    return res.status(200).send(priceOverrides)
  } catch (error) {
    void logger.log(
      'GET_PRICE_OVERRIDES_ERROR',
      'Error getting the price Overrides', {
        error
      }
    )

    return res.status(500).send('Something went wrong when trying to get the price overrides')
  }
}
export async function createPriceOverrides (req: Request, res: Response): Promise<Response> {
  const elements = req.body as PriceOverrideInput[]

  try {
    const errors = [] as string[]
    await Promise.all(elements.map(async ({ id = '', price, type }) => {
      const item = { price: 0 } // all.find((c) => c.type === type && c.id === id)

      if (item !== null) {
        const priceOverride = await PriceOverride.findOne({ where: { id, type } })

        if ((priceOverride == null) && (price !== null) && Number(item.price) !== Number(price)) {
          await PriceOverride.create({ id, price, type })
        } else if (Number(item.price) === Number(price) || price === null) {
          await PriceOverride.destroy({ where: { id, type } })
        } else {
          await PriceOverride.update({ price }, { where: { id, type } })
        }
      } else {
        errors.push(`${id} is not a valid item`)
      }
    }))

    if (errors.length > 0) {
      void logger.log(
        'CREATE_PRICE_OVERRIDES_ERROR',
        'Error creating the price overrides', {
          errors
        }
      )

      return res.status(400).send({ errors })
    }

    return res.status(200).send({ message: 'Success' })
  } catch (error) {
    void logger.log(
      'CREATE_PRICE_OVERRIDES_ERROR',
      'Error creating the price overrides', {
        error
      }
    )

    return res.status(500).send('Failed to create price overrides')
  }
}

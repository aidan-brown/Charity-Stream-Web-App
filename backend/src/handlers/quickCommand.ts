import { Request, Response } from 'express'
import QuickCommand, { QuickCommandInput } from '../db/models/quickCommand'
import { logger } from '../utils'

export async function getQuickCommands (_: Request, res: Response): Promise<Response> {
  try {
    const quickCommands = await QuickCommand.findAll()

    return res.status(200).send(quickCommands)
  } catch (error) {
    void logger.warn(
      'GET_QUICK_COMMANDS',
      'Error getting the quick commands', {
        error
      }
    )

    return res.status(500).send('Something went wrong when trying to get the quick commands')
  }
}
export async function createOrUpdateQuickCommand (req: Request, res: Response): Promise<Response> {
  const newCommand = req.body as QuickCommandInput
  const { id } = newCommand

  try {
    if (id === null) {
      const { id: newId } = await QuickCommand.create(newCommand)

      return res.status(200).send({ message: 'Success', newId })
    } else {
      await QuickCommand.update(newCommand, {
        where: {
          id
        }
      })

      return res.status(200).send({ message: 'Success' })
    }
  } catch (error) {
    void logger.log(
      'CREATE_QUICK_COMMANDS_ERROR',
      'Error creating or updating quick command', {
        error
      }
    )

    return res.status(500).send('Failed to create quick command')
  }
}
export async function deleteQuickCommand (req: Request, res: Response): Promise<Response> {
  const { commandId } = req.params
  try {
    await QuickCommand.destroy({
      where: {
        id: commandId
      }
    })

    return res.status(200).send({ message: 'Success' })
  } catch (error) {
    void logger.log(
      'DELETE_QUICK_COMMANDS_ERROR',
      'Error deleting quick command', {
        error
      }
    )

    return res.status(500).send('Failed to delete quick command')
  }
}

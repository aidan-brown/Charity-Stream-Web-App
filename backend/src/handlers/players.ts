import { Request, Response } from 'express'
import Player, { PlayerInput } from '../db/models/player'
import { logger } from '../utils'

export async function getPlayers (_: Request, res: Response): Promise<Response> {
  try {
    const players = await Player.findAll()

    return res.send(players).status(200)
  } catch (error) {
    logger.log('GET_PLAYERS_ERROR', 'Error getting the players', { error })

    return res.send('There was an error getting the players').status(500)
  }
}

export async function createPlayers (req: Request, res: Response): Promise<Response> {
  const players = req.body as PlayerInput[]

  if (!Array.isArray(players)) {
    return res.status(400).send('Must provide array in body')
  }

  const errors = [] as string[]
  const newPlayers = [] as Player[]
  try {
    await Promise.all(players.map(async (player) => {
      const existing = await Player.findAll({ where: { username: player.username } })

      if (existing.length === 0) {
        newPlayers.push(await Player.create(player))
      } else {
        errors.push(`A Player with the username ${player.username ?? ''} already exists`)
      }
    }))

    if (errors.length > 0) {
      logger.log('CREATE_PLAYERS_ERROR', 'Error creating the players', { errors })
    }

    return res.status(errors.length === 0 ? 200 : 400).send({
      ...(errors.length > 0 && { errors }),
      newPlayers
    })
  } catch (error) {
    logger.log('CREATE_PLAYERS_ERROR', 'Error creating the players', { error })

    return res.send({
      errors: [
        ...errors,
        'An unexpected error occurred with the MySQL server']
    }).status(500)
  }
}

export async function deletePlayer (req: Request, res: Response): Promise<Response> {
  const { username } = req.params

  try {
    const toDelete = await Player.findByPk(username)

    if (toDelete != null) {
      await toDelete.destroy()
      return res.status(200).send('Player Deleted')
    } else {
      logger.warn('PLAYER_DELETE_DNE', 'Player does not exist to be deleted', {
        username
      })

      return res.status(404).send('Player not found')
    }
  } catch (error) {
    logger.error('DELETE_PLAYER_ERROR', 'Error deleting the player', { error, username })

    return res.status(500).send('An error occurred')
  }
}

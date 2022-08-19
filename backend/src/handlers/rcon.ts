import { Request, Response } from 'express'
import { Rcon } from 'rcon-client'
import { sleep, logger } from '../utils'

interface RconCommand {
  command: string
  shouldWait: boolean
}

export default async function runRconCommands (req: Request, res: Response): Promise<Response> {
  const commands = req.body as RconCommand[]

  try {
    const rcon = await Rcon.connect({
      host: process.env.MC_SERVER_HOST ?? 'localhost',
      port: Number(process.env.MC_SERVER_RCON_PORT) ?? 1234,
      password: process.env.MC_SERVER_RCON_PASSWORD ?? 'password'
    })

    let waits = 0
    commands.forEach(({ command, shouldWait }, i) => {
      waits += shouldWait ? 1 : 0
      sleep(1000 * waits, async () => {
        await rcon.send(command)
        if (i === commands.length - 1) await rcon.end()
      })
    })

    logger.info('SCHEDULED_COMMANDS', 'Successfully scheduled commands', { commands })

    return res.status(200).send('Those should run TM')
  } catch (error) {
    logger.error('SCHEDULE_COMMANDS_FAILED', 'Failed to schedule RCON commands to be run', {
      error, commands
    })

    return res.status(500).send('Those did not run TM')
  }
}

import { Rcon } from 'rcon-client';
import Command, { Status } from '../db/models/command';
import logger from './logger';

export default async function rcon (scheduled: Date): Promise<void> {
  const cronId = scheduled.getTime();

  try {
  // If any commands need to be run, set the cron timeStamp
  // on the command (max 20)
    const [updates] = await Command.update({ cronId }, {
      where: {
        status: Status.READY,
        cronId: null
      },
      limit: 20
    });

    // If we found rows to update
    if (updates !== 0) {
    // Get all these updated commands
      const commands = await Command.findAll({
        where: {
          status: 'READY',
          cronId
        }
      });

      // Connect to the server for this instance
      const rcon = await Rcon.connect({
        host: process.env.MC_SERVER_HOST ?? 'localhost',
        port: Number(process.env.MC_SERVER_RCON_PORT) ?? 1234,
        password: process.env.MC_SERVER_RCON_PASSWORD ?? 'password'
      });

      // Mark commands as running
      await Command.update({ status: Status.RUNNING }, { where: { cronId } });

      // Now we want to loop through all the commands
      // and run them as many times as
      /* eslint-disable no-await-in-loop */
      for (let i = 0; i < commands.length; i += 1) {
        const { commandText, id } = commands[i];

        // Run the command against the server
        await rcon.send(commandText);

        // Set this command as finished, as it has now run
        await Command.update({ status: Status.FINISHED }, { where: { id } });
      }
      /* eslint-enable no-await-in-loop */

      // Close the command
      await rcon.end();
    }
  } catch (error) {
    void logger.error('RCON_SCHEDULE_FAILED', 'Failed to run RCON commands', { error });

    // We want to make sure the failed commands will be run, so we reschedule them
    try {
      await Command.update({
        cronId: null,
        status: Status.WAITING
      }, {
        where: {
          cronId,
          status: 'RUNNING'
        }
      });
    } catch (err) {
      void logger.error(
        'RCON_SCHEDULE_BACKUP_FAILED',
        'Failed to reschedule commands to be run', {
          originalError: error, error: err
        });
    }
  }
}

import Log, { LogType } from '../db/models/log'

async function log (type: LogType, code: string, message: string, additional: (any | null) = null): Promise<void> {
  const outputFunc = type === 'ERROR' ? process.stderr : process.stdout

  outputFunc.write(`${type}: [${code}] ${message} ${additional !== null ? JSON.stringify(additional) : ''}\n`)

  if (type !== LogType.LOG) {
    try {
      await Log.create({
        code,
        type,
        message,
        ...(additional !== null && { additional: JSON.stringify(additional) })
      })
    } catch (error) {
      process.stdout.write(
        `[ERROR]: Could not add error log (which is ironic since this is the error log), err: ${
          JSON.stringify(error)
        }`
      )
    }
  }
}

const logger = {
  error: async function (code: string, message: string, additional?: (any | null)) {
    await log(LogType.ERROR, code, message, additional)
  },
  warn: async function (code: string, message: string, additional?: (any | null)) {
    await log(LogType.WARN, code, message, additional)
  },
  info: async function (code: string, message: string, additional?: (any | null)) {
    await log(LogType.INFO, code, message, additional)
  },
  log: async function (code: string, message: string, additional?: (any | null)) {
    await log(LogType.LOG, code, message, additional)
  }
}

export default logger

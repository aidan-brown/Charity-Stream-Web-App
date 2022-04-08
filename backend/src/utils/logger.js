let LogTable;

const logger = async (type, code, message, additional = null) => {
  const outputFunc = type === 'ERROR' ? process.stderr : process.stdout;

  outputFunc.write(`${type}: [${code}] ${message} ${additional ? JSON.stringify(additional) : ''}\n`);

  if (type !== 'LOG') {
    try {
      await LogTable.create({
        code,
        type,
        message,
        ...(additional && { additional: JSON.stringify(additional) }),
      });
    } catch (error) {
      process.stdout.write('[ERROR]: Could not add error log (which is ironic since this is the error log)',
        JSON.stringify({ error }));
    }
  }
};

module.exports = {
  error: (code, message, additional) => logger('ERROR', code, message, additional),
  warn: (code, message, additional) => logger('WARN', code, message, additional),
  info: (code, message, additional) => logger('INFO', code, message, additional),
  log: (code, message, additional) => logger('LOG', code, message, additional),
  setLogTable: (logTable) => {
    LogTable = logTable;
  },
};

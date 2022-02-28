const { Replace, Select, Delete } = require('../sql/sqlFunctions');
const safeJsonParse = require('../utils/safeJsonParse');

const getData = async (_, res) => {
  try {
    res.status(200).send(await Select(null, 'serverData'));
  } catch (error) {
    const { code = 500, message = error.message } = safeJsonParse(error.message);
    res.status(code).send(message);
  }
};

const dataCallback = async (req, res) => {
  const newData = req.body;
  const currentData = await Select(null, 'serverData');

  const updates = {};

  try {
    newData.forEach((player) => {
      updates[player.username] = true;
      Replace('serverData', Object.keys(player), Object.values(player));
    });

    currentData.forEach(({ username }) => {
      if (!updates[username]) Delete('serverData', `username='${username}'`);
    });

    res.status(200).send('Successfully updated player data');
  } catch (error) {
    const { code = 500, message = error.message } = safeJsonParse(error.message);
    res.status(code).send(message);
  }
};

module.exports = {
  dataCallback,
  getData,
};

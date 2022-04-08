const { Op } = require('sequelize');
const { Log } = require('../sql/models');

module.exports = {
  getAnalytics: async (req, res) => {
    const {
      code, message, type, additional,
    } = req.query;

    try {
      const logs = await Log.findAll({
        where: {
          ...(additional && {
            additional: {
              [Op.like]: `%${additional}%`,
            },
          }),
          ...(type && {
            type,
          }),
          ...(message && {
            message: {
              [Op.like]: `%${message}%`,
            },
          }),
          ...(code && {
            code,
          }),
        },
      });

      res.status(200).send(logs);
    } catch (error) {
      res.status(500).send('Something went wrong when getting those logs');
    }
  },
};

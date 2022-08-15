const { Account } = require('../sql/models');

module.exports = {
  getAccount: async (req, res) => {
    const { user = {} } = req;

    try {
      const { id, service } = user;
      const account = await Account.findOne({
        where: { id, service },
      });

      if (account) {
        return res.status(200).send(account);
      }

      return res.status(404).send('Account not found');
    } catch (err) {
      return res.status(500).send('Internal Server Error');
    }
  },
};

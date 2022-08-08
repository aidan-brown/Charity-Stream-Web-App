const { Account } = require('../sql/models');

module.exports = {
  getAccount: async (req, res) => {
    const { user } = req;

    try {
      const account = await Account.findByPk(user.id);

      if (account) {
        return res.status(200).send(account);
      }

      return res.status(404).send('Account not found');
    } catch (err) {
      return res.status(500).send('Internal Server Error');
    }
  },
};

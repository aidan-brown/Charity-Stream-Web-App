let AccountTable;

module.exports = {
  verifyRole: (...roles) => async (req, res, next) => {
    const { user } = req;

    if (user) {
      const { id, service } = user;
      const account = await AccountTable.findOne({ where: { id, service } });

      if (account && roles.includes(account.role)) {
        return next();
      }
    }

    return res.status(401).send('Unauthorized');
  },
  setAccountTable: (accountTable) => {
    AccountTable = accountTable;
  },
};

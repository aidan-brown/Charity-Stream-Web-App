let AccountTable;

const Roles = {
  ADMIN: 'ADMIN',
  USER: 'USER',
};

module.exports = {
  Roles,
  verifyRole: (...roles) => async (req, res, next) => {
    const { user } = req;

    if (user) {
      const { role } = await AccountTable.findByPk(user.id);

      if (roles.includes(role)) {
        return next();
      }
    }

    return res.status(401).send('Unauthorized');
  },
  setAccountTable: (accountTable) => {
    AccountTable = accountTable;
  },
};

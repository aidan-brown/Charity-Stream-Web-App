let AccountTable;

const Roles = {
  ADMIN: 'ADMIN',
  USER: 'USER',
};

module.exports = {
  Roles,
  verifyRole: (role) => async (req, res, next) => {
    const { user } = req;

    if (user) {
      const { role: assignedRole } = await AccountTable.findByPk(user.id);

      if (role === assignedRole) {
        return next();
      }
    }

    return res.status(401).send('Unauthorized');
  },
  setAccountTable: (accountTable) => {
    AccountTable = accountTable;
  },
};

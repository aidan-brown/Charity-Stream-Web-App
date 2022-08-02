const { Command, Checkout, Player } = require('../sql/models');

module.exports = {
  getStats: async (_, res) => {
    try {
      const stats = {};

      (await Player.findAll())
        .forEach((p) => {
          stats[p.username] = {
            amountRaised: 0,
            numDonations: 0,
            commandsFor: 0,
          };
        });
      const checkouts = await Checkout.findAll({
        where: {
          status: 'ACCEPTED',
        },
        include: Command,
      });

      checkouts.forEach((checkout) => {
        const { Commands, subTotal } = checkout;

        Object.keys(stats).forEach((username) => {
          let foundPlayer = false;

          Commands.forEach((command) => {
            const { commandText } = command;

            if (commandText.includes(username)) {
              foundPlayer = true;
              stats[username].commandsFor += 1;
            }
          });

          if (foundPlayer) {
            stats[username].amountRaised += subTotal;
            stats[username].numDonations += 1;
          }
        });
      });

      res.status(200).send(Object.keys(stats).map((username) => ({
        ...stats[username],
        username,
        amountRaised: Number((stats[username].amountRaised).toFixed(2)),
      })).sort((a, b) => b.amountRaised - a.amountRaised));
    } catch (err) {
      console.log(err);
      res.status(500).send('Uh oh');
    }
  },
};

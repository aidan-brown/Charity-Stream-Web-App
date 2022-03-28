const axios = require('axios');
const {
  Checkout, Player, DisabledElement, Command,
} = require('../sql/models');
const { all } = require('../minecraftData');
const { getUrl } = require('../utils');

const types = ['armor', 'tool', 'weapon', 'food', 'material', 'mob', 'effect'];

const verifyPlayer = async (username) => {
  const [player] = await Player.findAll({ where: { username } });
  return !!player;
};

const verifyPurchase = async (product) => {
  const {
    id, type, price, power, time,
  } = product;

  if (types.includes(type)) {
    const item = all.find((i) => i.id === id && i.type === type);
    if (item) {
      const [disabled] = await DisabledElement.findAll({ where: { id } });

      if (!disabled) {
        const { price: p } = item;

        return price === p && (type === 'effect' ? power < 10 && time <= 300 : true);
      }
    }
  }
  return false;
};

module.exports = {
  verifyCart: async (req, res) => {
    const { username, cart } = req.body;

    try {
      if (!await verifyPlayer(username)) {
        res.status(400).send('Player does not exist');
      } else {
        const commands = [];
        let subTotal = 0;
        const cartStatus = await [true, ...cart].reduce(async (previousItem, item) => {
          const {
            id, price, time, power, type, amount = 1,
          } = item;

          if (await verifyPurchase(item)) {
            let cost = price;
            let cmd;
            if (type === 'effect') {
              cost *= (time / 30) * (power + 1);
              commands.push({
                commandText: `effect give ${username} ${id} ${time} ${power + 1}`,
              });
            } else if (type === 'mob') {
              const totalGroups = Math.ceil(amount / 10);
              const leftOver = amount % 10;

              [...Array(totalGroups)].forEach((_, i) => {
                let num = 10;
                if (i === totalGroups - 1 && leftOver !== 0) num = leftOver;

                commands.push({
                  commandText: `execute at ${
                    username
                  } run summon minecraft:area_effect_cloud ~ ~ ~ {Passengers:[${
                    [...Array(num)].map(() => `{id:${id}}`).join(',')
                  }]}`,
                });
              });
            } else {
              cmd = `give ${username} ${id}`;
              if (id === 'arrow') {
                const totalArrows = amount * 10;
                cmd += ` ${totalArrows}`;
              } else cmd += ` ${amount}`;

              commands.push({
                commandText: cmd,
              });
            }

            subTotal += cost * amount;

            return previousItem;
          }
          return previousItem && false;
        });

        if (!cartStatus) {
          res.status(400).send('There is something wrong with your cart');
        } else {
          const checkout = await Checkout.create({
            subTotal: subTotal.toFixed(2),
            status: 'PENDING',
            Commands: commands,
          }, {
            include: [Command],
          });

          const exitUrl = encodeURIComponent(`${getUrl()}/JUSTGIVING-DONATION-ID/${checkout.id}`);
          const redirectUrl = `http://link.justgiving.com/v1/fundraisingpage/donate/pageId/15252893?amount=${subTotal.toFixed(2)}&currency=USD&reference=mcstream&exitUrl=${exitUrl}`;

          res.status(200).send(redirectUrl);
        }
      }
    } catch (_) {
      res.status(500).send('Failed to create checkout');
    }
  },
  verifyDonation: async (req, res) => {
    const { donationID, checkoutID } = req.body;

    try {
      const [checkout] = await Checkout.findAll({ where: { id: checkoutID } });

      if (!checkout) {
        res.status(404).send('Checkout session not found');
      } else {
        const { JG_APPID, JG_AUTH } = process.env;
        const { data } = await axios.default.get(`https://api.justgiving.com/${JG_APPID}/v1/donation/${donationID}`, {
          headers: {
            Basic: `${JG_AUTH}`,
          },
        });

        const { subTotal, status } = checkout;
        const { donorLocalAmount } = data;

        if (status === 'PENDING') {
          if (subTotal <= Number(donorLocalAmount).toFixed(2)) {
            checkout.donationID = donationID;
            checkout.status = 'ACCEPTED';

            await Command.update({ status: 'READY' }, {
              where: {
                CheckoutId: checkout.id,
              },
            });
            await checkout.save();

            res.status(200).send('Commands marked as READY!');
          } else {
            res.status(400).send('Donation amounts did not line up, not running commands');
          }
        } else {
          res.status(400).send('Commands have already been scheduled');
        }
      }
    } catch (_) {
      res.status(500).send('Something on our end went wrong');
    }
  },
};

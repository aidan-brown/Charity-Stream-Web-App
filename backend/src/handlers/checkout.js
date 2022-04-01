const axios = require('axios');
const {
  Checkout, Player, DisabledElement, Command, PriceOverride,
} = require('../sql/models');
const { all } = require('../minecraftData');
const { getUrl } = require('../utils');
const { TYPES } = require('../constants');

const verifyPlayer = async (username) => {
  const [player] = await Player.findAll({ where: { username } });
  return !!player;
};

const verifyPurchase = async (product) => {
  const {
    id, type, power, time,
  } = product;

  if (TYPES.includes(type)) {
    const item = all.find((i) => i.id === id && i.type === type);
    if (item) {
      const [disabled] = await DisabledElement.findAll({ where: { id, type } });

      if (!disabled) {
        return type === 'effect' ? power < 10 && time <= 300 : true;
      }
    }
  }
  return false;
};

const verifyPrice = async (id, type, price, item) => {
  const [priceOverride] = await PriceOverride.findAll({ where: { id, type } });

  if (!priceOverride) {
    if (price === item.price) return price;
    return null;
  }

  if (priceOverride.price !== price) {
    const { updatedAt } = priceOverride;

    // We will not honor the old price if this is true
    if ((new Date().getTime() - new Date(updatedAt).getTime()) / 1000 > 10) return null;
    if (price !== item.price) return null;
  }

  return price;
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
            id: rawId, price, time, power, type, amount = 1,
          } = item;
          const { nbt } = all.find((i) => i.id === rawId && i.type === type) || {};
          const [id] = rawId.split('-');

          if (await verifyPurchase({ ...item, id })) {
            const truePrice = await verifyPrice(id, type, price, item);

            if (!truePrice) return false;

            let cost = truePrice;
            if (type === 'effect') {
              cost *= (time / 30) * (power + 1);
              commands.push({
                commandText: `effect give ${username} ${id}${nbt || ''} ${time} ${power + 1}`,
              });
            } else if (type === 'mob') {
              if (nbt) {
                [...Array(amount)].forEach(() => {
                  commands.push({
                    commandText: `execute at ${username} run summon ${id} ~ ~ ~ ${nbt || ''}`,
                  });
                });
              } else {
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
              }
            } else {
              let cmd = `give ${username} ${id}${nbt || ''}`;
              if (id === 'arrow' || id === 'tipped_arrow' || id === 'spectral_arrow') {
                const totalArrows = amount * 10;
                cmd += ` ${totalArrows}`;
              } else cmd += ` ${amount}`;

              commands.push({
                commandText: cmd,
              });

              if (id === 'bow' || id === 'crossbow') {
                commands.push({
                  commandText: `give ${username} arrow 20`,
                });
              }
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

const axios = require('axios');
const {
  Checkout, Player, DisabledElement, Command, PriceOverride,
} = require('../sql/models');
const { all } = require('../minecraftData');
const { getUrl, logger } = require('../utils');
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
        logger.warn('PLAYER_DNE', 'Verify checkout player does not exist', { username });

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

          if (await verifyPurchase(item)) {
            const truePrice = await verifyPrice(id, type, price, item);

            if (!truePrice) return false;

            let cost = truePrice;
            if (type === 'effect') {
              cost *= (time / 30) * (power + 1);
              commands.push({
                commandText: `minecraft:effect give ${username} ${id}${nbt || ''} ${time} ${power + 1}`,
              });
            } else if (type === 'mob') {
              if (nbt) {
                [...Array(amount)].forEach(() => {
                  commands.push({
                    commandText: `minecraft:execute at ${username} run summon ${id} ~ ~ ~ ${nbt || ''}`,
                  });
                });
              } else {
                const totalGroups = Math.ceil(amount / 10);
                const leftOver = amount % 10;

                [...Array(totalGroups)].forEach((_, i) => {
                  let num = 10;
                  if (i === totalGroups - 1 && leftOver !== 0) num = leftOver;

                  commands.push({
                    commandText: `minecraft:execute at ${
                      username
                    } run summon minecraft:area_effect_cloud ~ ~ ~ {Passengers:[${
                      [...Array(num)].map(() => `{id:${id}}`).join(',')
                    }]}`,
                  });
                });
              }
            } else {
              let cmd = `minecraft:give ${username} ${id}${nbt || ''}`;
              if (id === 'arrow' || id === 'tipped_arrow' || id === 'spectral_arrow') {
                const totalArrows = amount * 10;
                cmd += ` ${totalArrows}`;
              } else cmd += ` ${amount}`;

              commands.push({
                commandText: cmd,
              });

              if (id === 'bow' || id === 'crossbow') {
                commands.push({
                  commandText: `minecraft:give ${username} arrow 20`,
                });
              }
            }

            subTotal += cost * amount;

            return previousItem;
          }
          return previousItem && false;
        });

        if (!cartStatus) {
          logger.warn('CART_VERIFY_FAILED', 'Cart verification failed', { cart });

          res.status(400).send('There is something wrong with your cart');
        } else {
          const checkout = await Checkout.create({
            subTotal: subTotal.toFixed(2),
            status: 'PENDING',
            Commands: commands,
          }, {
            include: [Command],
          });

          const exitUrl = encodeURIComponent(`${getUrl()}/donation-confirmation/JUSTGIVING-DONATION-ID/${checkout.id}`);
          const redirectUrl = `http://link.justgiving.com/v1/fundraisingpage/donate/pageId/15252893?amount=${subTotal.toFixed(2)}&currency=USD&reference=mcstream&exitUrl=${exitUrl}`;

          logger.info('CHECKOUT_CREATED', 'Successfully created checkout', {
            checkoutID: checkout.id,
          });

          res.status(200).send(redirectUrl);
        }
      }
    } catch (err) {
      logger.error('VERIFY_CART', 'Failed to verify cart', { err });

      res.status(500).send('Failed to create checkout');
    }
  },
  verifyDonation: async (req, res) => {
    const { donationID, checkoutID } = req.body;

    try {
      const [checkout] = await Checkout.findAll({ where: { id: checkoutID } });
      const [donation] = await Checkout.findAll({ where: { donationID } });

      if (donation) {
        logger.warn('DONATION_ID_TWICE', 'DonationID has already been used', { donationID });

        res.status(400).send({
          code: 'DONATION_ID_TWICE',
          message: 'Oops, looks like this Donation ID has already been used. (this can be from refreshing this page, you can just close this window and head back to the main site!)',
        });
        return;
      }

      if (!checkout) {
        logger.warn('CHECKOUT_NOT_FOUND', 'Checkout session not found', {
          checkoutID, donationID,
        });

        res.status(404).send({
          code: 'CHECKOUT_NOT_FOUND',
          message: 'We could not find that checkout, reach out to us on Twitch with the code below and we will try and help!',
        });
      } else {
        const { JG_APPID, JG_AUTH } = process.env;
        const { data } = await axios.default.get(
          `https://api.justgiving.com/${JG_APPID}/v1/donation/${donationID}`, {
            headers: {
              Basic: `${JG_AUTH}`,
            },
          },
        );

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

            logger.info('PURCHASE_SUCCESS', 'Successful purchase made', {
              checkoutID, donationID, subTotal,
            });

            res.status(200).send({
              code: 'DONATION_VERIFY_SUCCESS',
              message: 'Success',
            });
          } else {
            logger.warn('DONATION_MISMATCH', 'Purchase successful prices did not line up', {
              donorLocalAmount, subTotal, checkoutID, donationID,
            });

            res.status(400).send({
              code: 'DONATION_MISMATCH',
              message: 'Looks like the donation amount we got back from Just Giving didn\'t line up with what it should have been. Your donation still counted but we won\'t give the things you checked out with. If you think this is an error, reach out to us on Twitch with the code below and we will try and help!',
            });
          }
        } else {
          logger.warn('COMMANDS_SCHEDULED_TWICE', 'Tried to schedule commands again', {
            donationID, checkoutID,
          });

          res.status(400).send({
            code: 'COMMANDS_SCHEDULED_TWICE',
            message: 'Reach out to us on Twitch with the code below and we will try and help!',
          });
        }
      }
    } catch (err) {
      logger.error('VERIFY_DONATION_FAILED', 'Failed to create checkout', {
        error: err, donationID, checkoutID,
      });

      res.status(500).send({
        code: 'VERIFY_DONATION_FAILED',
        message: 'Reach out to us on Twitch with the code below and we will try and help!',
      });
    }
  },
};

const axios = require('axios');
const checkout = require('../checkout');
const {
  Checkout, Player, DisabledElement, Command, PriceOverride,
} = require('../../sql/models');
const { getUrl, logger } = require('../../utils');

jest.mock('axios');
jest.mock('../../utils', () => ({
  getUrl: jest.fn(() => 'http://localhost:3000'),
  logger: {
    warn: jest.fn(),
    info: jest.fn(),
    error: jest.fn(),
  },
}));
jest.mock('../../sql/models', () => ({
  Checkout: {
    findAll: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  },
  DisabledElement: {
    findAll: jest.fn(),
  },
  Command: {
    findAll: jest.fn(),
    update: jest.fn(),
  },
  Player: {
    findAll: jest.fn(),
  },
  PriceOverride: {
    findAll: jest.fn(),
  },
}));

describe('Checkout Integration', () => {
  let req;
  let res;

  describe('should call verify-checkout', () => {
    const jgSuccessUrl = (price) => `http://link.justgiving.com/v1/fundraisingpage/donate/pageId/15252893?amount=${price}&currency=USD&reference=mcstream&exitUrl=undefined%2Fdonation-confirmation%2FJUSTGIVING-DONATION-ID%2F1`;

    beforeEach(() => {
      req = {
        body: {
          cart: [{
            id: 'leather_helmet',
            type: 'armor',
            amount: 2,
            price: 1.00,
          }],
          player: 'fakeplayer',
        },
      };
      res = {
        status: jest.fn(() => res),
        send: jest.fn(() => res),
      };

      axios.get.mockResolvedValue({ data: {} });
      Player.findAll.mockResolvedValue([{ username: 'fakeplayer' }]);
      DisabledElement.findAll.mockResolvedValue([]);
      PriceOverride.findAll.mockResolvedValue([]);
      Checkout.create.mockResolvedValue({ id: 1 });
    });

    test('returns verify-checkout success', async () => {
      await checkout.verifyCheckout(req, res);

      expect(res.send).toHaveBeenCalledWith(jgSuccessUrl('2.00'));
      expect(res.status).toHaveBeenCalledWith(200);
    });

    describe('verify item', () => {
      test('player does not exist', async () => {
        Player.findAll.mockResolvedValue([]);

        await checkout.verifyCheckout(req, res);

        expect(logger.warn).toHaveBeenCalledWith('PLAYER_DNE', 'Verify checkout player does not exist', {
          player: 'fakeplayer',
        });
        expect(res.send).toHaveBeenCalledWith('fakeplayer does not exist');
        expect(res.status).toHaveBeenCalledWith(404);
      });

      test('subtotal less than $2.00', async () => {
        const errors = ['Cart Subtotal does not exceed $2.00'];
        req.body.cart = [];
        await checkout.verifyCheckout(req, res);

        expect(logger.warn).toHaveBeenCalledWith('VERIFY_CART_ERROR', 'Verify cart found an error', {
          errors,
        });
        expect(res.send).toHaveBeenCalledWith({
          errors,
          message: 'Something is wrong with your cart',
        });
        expect(res.status).toHaveBeenCalledWith(400);
      });

      test('item disabled', async () => {
        const errors = [{
          leather_helmet: {
            verifyItemMsg: 'leather_helmet is currently disabled',
            getPriceMsg: undefined,
          },
        }];
        DisabledElement.findAll.mockResolvedValue([{
          id: 'leather_helmet',
          type: 'armor',
          disabled: true,
        }]);

        await checkout.verifyCheckout(req, res);

        expect(logger.warn).toHaveBeenCalledWith('VERIFY_CART_ERROR', 'Verify cart found an error', {
          errors,
        });
        expect(res.send).toHaveBeenCalledWith({
          errors,
          message: 'Something is wrong with your cart',
        });
        expect(res.status).toHaveBeenCalledWith(400);
      });

      test('item doesn\'t exist', async () => {
        const errors = [{
          not_an_item: {
            getPriceMsg: 'not_an_item is not a valid item',
            verifyItemMsg: 'not_an_item does not exist',
          },
        }];

        req.body.cart[0].id = 'not_an_item';
        await checkout.verifyCheckout(req, res);

        expect(logger.warn).toHaveBeenCalledWith('VERIFY_CART_ERROR', 'Verify cart found an error', {
          errors,
        });
        expect(res.send).toHaveBeenCalledWith({
          errors,
          message: 'Something is wrong with your cart',
        });
        expect(res.status).toHaveBeenCalledWith(400);
      });
    });

    describe('price override', () => {
      test('active success', async () => {
        PriceOverride.findAll.mockResolvedValue([{
          id: 'leather_helmet',
          type: 'armor',
          price: 1.00,
          updatedAt: '2022-01-01 01:00:00',
        }]);

        req.body.cart[0].price = 1.00;
        await checkout.verifyCheckout(req, res);

        expect(res.send).toHaveBeenCalledWith(jgSuccessUrl('2.00'));
        expect(res.status).toHaveBeenCalledWith(200);
      });

      test('active failure', async () => {
        const errors = [{
          leather_helmet: {
            getPriceMsg: 'Price override active for leather_helmet (more than 10s)',
            verifyItemMsg: undefined,
          },
        }];

        PriceOverride.findAll.mockResolvedValue([{
          id: 'leather_helmet',
          type: 'armor',
          price: 3.00,
          updatedAt: '2022-01-01 01:00:00',
        }]);

        await checkout.verifyCheckout(req, res);

        expect(logger.warn).toHaveBeenCalledWith('VERIFY_CART_ERROR', 'Verify cart found an error', {
          errors,
        });
        expect(res.send).toHaveBeenCalledWith({
          errors,
          message: 'Something is wrong with your cart',
        });
        expect(res.status).toHaveBeenCalledWith(400);
      });

      test('active honor old price', async () => {
        PriceOverride.findAll.mockResolvedValue([{
          id: 'leather_helmet',
          type: 'armor',
          price: 5.00,
          updatedAt: new Date(),
        }]);

        await checkout.verifyCheckout(req, res);

        expect(res.send).toHaveBeenCalledWith(jgSuccessUrl('2.00'));
        expect(res.status).toHaveBeenCalledWith(200);
      });
    });

    describe('command creation', () => {
      test('count on item', async () => {
        req.body.cart = [{
          id: 'lapis_lazuli',
          type: 'material',
          amount: 10,
          price: 0.80,
        }];

        await checkout.verifyCheckout(req, res);

        expect(Checkout.create).toHaveBeenCalledWith({
          subTotal: 8.00,
          status: 'PENDING',
          Commands: [{
            commandText: 'minecraft:give fakeplayer lapis_lazuli 100',
          }],
        }, { include: [Command] });
        expect(res.send).toHaveBeenCalledWith(jgSuccessUrl('8.00'));
        expect(res.status).toHaveBeenCalledWith(200);
      });

      test('effect', async () => {
        req.body.cart = [{
          id: 'absorption',
          type: 'effect',
          amount: 1,
          price: 2.00,
          power: 0,
          time: 30,
        }];

        await checkout.verifyCheckout(req, res);

        expect(Checkout.create).toHaveBeenCalledWith({
          subTotal: 2.00,
          status: 'PENDING',
          Commands: [{
            commandText: 'minecraft:effect give fakeplayer absorption 30 1',
          }],
        }, { include: [Command] });
        expect(res.send).toHaveBeenCalledWith(jgSuccessUrl('2.00'));
        expect(res.status).toHaveBeenCalledWith(200);
      });

      describe('mob', () => {
        test('no nbt tag less than 10', async () => {
          req.body.cart = [{
            id: 'cow',
            type: 'mob',
            amount: 10,
            price: 0.20,
          }];

          await checkout.verifyCheckout(req, res);

          expect(Checkout.create).toHaveBeenCalledWith({
            subTotal: 2.00,
            status: 'PENDING',
            Commands: [{
              commandText: 'minecraft:execute at fakeplayer run summon minecraft:area_effect_cloud ~ ~ ~ {Passengers:[{id:cow},{id:cow},{id:cow},{id:cow},{id:cow},{id:cow},{id:cow},{id:cow},{id:cow},{id:cow}]}',
            }],
          }, { include: [Command] });
          expect(res.send).toHaveBeenCalledWith(jgSuccessUrl('2.00'));
          expect(res.status).toHaveBeenCalledWith(200);
        });

        test('no nbt tag more than 10', async () => {
          req.body.cart = [{
            id: 'cow',
            type: 'mob',
            amount: 11,
            price: 0.40,
          }];

          await checkout.verifyCheckout(req, res);

          expect(Checkout.create).toHaveBeenCalledWith({
            subTotal: 2.20,
            status: 'PENDING',
            Commands: [{
              commandText: 'minecraft:execute at fakeplayer run summon minecraft:area_effect_cloud ~ ~ ~ {Passengers:[{id:cow},{id:cow},{id:cow},{id:cow},{id:cow},{id:cow},{id:cow},{id:cow},{id:cow},{id:cow}]}',
            },
            {
              commandText: 'minecraft:execute at fakeplayer run summon minecraft:area_effect_cloud ~ ~ ~ {Passengers:[{id:cow}]}',
            }],
          }, { include: [Command] });
          expect(res.send).toHaveBeenCalledWith(jgSuccessUrl('2.20'));
          expect(res.status).toHaveBeenCalledWith(200);
        });

        test('has nbt tag', async () => {
          req.body.cart = [{
            id: 'ender_dragon',
            type: 'mob',
            amount: 1,
            price: 120.00,
          }];

          await checkout.verifyCheckout(req, res);

          expect(Checkout.create).toHaveBeenCalledWith({
            subTotal: 120.00,
            status: 'PENDING',
            Commands: [{
              commandText: 'minecraft:execute at fakeplayer run summon ender_dragon ~ ~ ~ {DragonPhase:0}',
            }],
          }, { include: [Command] });
          expect(res.send).toHaveBeenCalledWith(jgSuccessUrl('120.00'));
          expect(res.status).toHaveBeenCalledWith(200);
        });
      });

      describe('item', () => {
        test('item no amount provided', async () => {
          req.body.cart = [{
            id: 'chainmail_chestplate',
            type: 'armor',
            price: 1.00,
          }];

          await checkout.verifyCheckout(req, res);

          expect(Checkout.create).toHaveBeenCalledWith({
            subTotal: 4.40,
            status: 'PENDING',
            Commands: [{
              commandText: 'minecraft:give fakeplayer chainmail_chestplate 1',
            }],
          }, { include: [Command] });
          expect(res.send).toHaveBeenCalledWith(jgSuccessUrl('4.40'));
          expect(res.status).toHaveBeenCalledWith(200);
        });

        test('item nbt tag', async () => {
          req.body.cart = [{
            id: 'trident',
            type: 'weapon',
            price: 4.00,
          }];

          await checkout.verifyCheckout(req, res);

          expect(Checkout.create).toHaveBeenCalledWith({
            subTotal: 4.00,
            status: 'PENDING',
            Commands: [{
              commandText: 'minecraft:give fakeplayer trident{Enchantments:[{id:loyalty,lvl:3}]} 1',
            }],
          }, { include: [Command] });
          expect(res.send).toHaveBeenCalledWith(jgSuccessUrl('4.00'));
          expect(res.status).toHaveBeenCalledWith(200);
        });

        test.each`
          id            | price
          ${'bow'}      | ${'3.80'} 
          ${'crossbow'} | ${'8.40'}
        `('$id', async ({ id, price }) => {
          req.body.cart = [{
            id,
            type: 'weapon',
            price,
          }];

          await checkout.verifyCheckout(req, res);

          expect(Checkout.create).toHaveBeenCalledWith({
            subTotal: Number(price),
            status: 'PENDING',
            Commands: [{
              commandText: `minecraft:give fakeplayer ${id} 1`,
            }, {
              commandText: 'minecraft:give fakeplayer arrow 20',
            }],
          }, { include: [Command] });
          expect(res.send).toHaveBeenCalledWith(jgSuccessUrl(price));
          expect(res.status).toHaveBeenCalledWith(200);
        });
      });
    });

    test('500 - internal server error', async () => {
      const error = new Error('Error');
      Player.findAll.mockImplementation(() => {
        throw error;
      });

      await checkout.verifyCheckout(req, res);

      expect(logger.error).toHaveBeenCalledWith('VERIFY_CART', 'Failed to verify cart', {
        error,
      });
      expect(res.send).toHaveBeenCalledWith('Internal server error, failed to create checkout');
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('verify-donation', () => {
    beforeEach(() => {
      req = {
        body: {
          donationID: 1234,
          checkoutID: 1,
        },
      };
      res = {
        status: jest.fn(() => res),
        send: jest.fn(() => res),
      };

      axios.get.mockResolvedValue({ data: { donorLocalAmount: 3.00 } });
    });

    test('successful purchase', async () => {
      Checkout.findAll.mockResolvedValueOnce([{
        subTotal: 3.00,
        id: 1,
        status: 'PENDING',
        save: jest.fn(),
      }]);
      Checkout.findAll.mockResolvedValueOnce([]);

      await checkout.verifyDonation(req, res);

      expect(logger.info).toHaveBeenCalledWith(
        'PURCHASE_SUCCESS',
        'Successful purchase made',
        {
          checkoutID: 1,
          donationID: 1234,
          subTotal: 3,
        },
      );
      expect(res.send).toHaveBeenCalledWith({
        code: 'DONATION_VERIFY_SUCCESS',
        message: 'Success',
      });
      expect(res.status).toHaveBeenCalledWith(200);
    });

    test('successful purchase 10 cents less', async () => {
      Checkout.findAll.mockResolvedValueOnce([{
        subTotal: 3.00,
        id: 1,
        status: 'PENDING',
        save: jest.fn(),
      }]);
      Checkout.findAll.mockResolvedValueOnce([]);
      axios.get.mockResolvedValue({ data: { donorLocalAmount: 2.90 } });

      await checkout.verifyDonation(req, res);

      expect(logger.info).toHaveBeenCalledWith(
        'PURCHASE_SUCCESS',
        'Successful purchase made',
        {
          checkoutID: 1,
          donationID: 1234,
          subTotal: 3,
        },
      );
      expect(res.send).toHaveBeenCalledWith({
        code: 'DONATION_VERIFY_SUCCESS',
        message: 'Success',
      });
      expect(res.status).toHaveBeenCalledWith(200);
    });

    test('donation id used twice', async () => {
      Checkout.findAll.mockResolvedValue([{}]);

      await checkout.verifyDonation(req, res);

      expect(logger.warn).toHaveBeenCalledWith(
        'DONATION_ID_TWICE',
        'DonationID has already been used',
        { donationID: 1234 },
      );
      expect(res.send).toHaveBeenCalledWith({
        code: 'DONATION_ID_TWICE',
        message: 'This Donation ID has already been used. (this can be from refreshing this page, you can just close this window and head back to the main site!)',
      });
      expect(res.status).toHaveBeenCalledWith(400);
    });

    test('checkout not found', async () => {
      Checkout.findAll.mockResolvedValue([]);

      await checkout.verifyDonation(req, res);

      expect(logger.warn).toHaveBeenCalledWith(
        'CHECKOUT_NOT_FOUND',
        'Checkout session not found',
        { checkoutID: 1, donationID: 1234 },
      );
      expect(res.send).toHaveBeenCalledWith({
        code: 'CHECKOUT_NOT_FOUND',
        message: 'We could not find that checkout, reach out to us on Twitch with the code below and we will try and help!',
      });
      expect(res.status).toHaveBeenCalledWith(404);
    });

    test('commands already scheduled', async () => {
      Checkout.findAll.mockResolvedValueOnce([{
        subTotal: 3.00,
        id: 1,
        status: 'ACCEPTED',
        save: jest.fn(),
      }]);
      Checkout.findAll.mockResolvedValueOnce([]);

      await checkout.verifyDonation(req, res);

      expect(logger.warn).toHaveBeenCalledWith(
        'COMMANDS_SCHEDULED_TWICE',
        'Tried to schedule commands again',
        { checkoutID: 1, donationID: 1234 },
      );
      expect(res.send).toHaveBeenCalledWith({
        code: 'COMMANDS_SCHEDULED_TWICE',
        message: 'Reach out to us on Twitch with the code below and we will try and help!',
      });
      expect(res.status).toHaveBeenCalledWith(400);
    });

    test('Donation mismatch', async () => {
      Checkout.findAll.mockResolvedValueOnce([{
        subTotal: 5.00,
        id: 1,
        status: 'PENDING',
        save: jest.fn(),
      }]);
      Checkout.findAll.mockResolvedValueOnce([]);

      await checkout.verifyDonation(req, res);

      expect(logger.error).toHaveBeenCalledWith(
        'DONATION_MISMATCH',
        'Purchase successful prices did not line up',
        {
          checkoutID: 1,
          donationID: 1234,
          donorLocalAmount: 3,
          subTotal: 5,
        },
      );
      expect(res.send).toHaveBeenCalledWith({
        code: 'DONATION_MISMATCH',
        message: "Looks like the donation amount we got back from Just Giving didn't line up with what it should have been. Your donation still counted but we won't give the things you checked out with. If you think this is an error, reach out to us on Twitch with the code below and we will try and help!",
      });
      expect(res.status).toHaveBeenCalledWith(400);
    });

    test('500 - internal server error', async () => {
      const error = new Error('Error');
      Checkout.findAll.mockImplementation(() => {
        throw error;
      });

      await checkout.verifyDonation(req, res);

      expect(logger.error).toHaveBeenCalledWith('VERIFY_DONATION_FAILED', 'Failed to verify donation', {
        checkoutID: 1,
        donationID: 1234,
        error,
      });
      expect(res.send).toHaveBeenCalledWith({
        code: 'VERIFY_DONATION_FAILED',
        message: 'Reach out to us on Twitch with the code below and we will try and help!',
      });
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});

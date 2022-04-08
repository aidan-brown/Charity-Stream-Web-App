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
  },
  DisabledElement: {
    findAll: jest.fn(),
  },
  Command: {
    findAll: jest.fn(),
  },
  Player: {
    findAll: jest.fn(),
  },
  PriceOverride: {
    findAll: jest.fn(),
  },
}));

describe('Checkout Integration', () => {
  const jgSuccessUrl = 'http://link.justgiving.com/v1/fundraisingpage/donate/pageId/15252893?amount=2.00&currency=USD&reference=mcstream&exitUrl=undefined%2Fdonation-confirmation%2FJUSTGIVING-DONATION-ID%2F1';
  let req;
  let res;

  beforeEach(() => {
    req = {
      body: {
        cart: [{
          id: 'leather_helmet',
          type: 'armor',
          amount: 2,
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

  afterEach(() => {
    req = {
      body: {
        cart: [{
          id: 'leather_helmet',
          type: 'armor',
          amount: 2,
          price: 1,
        }],
        player: 'fakeplayer',
      },
    };
    res = {
      status: jest.fn(() => res),
      send: jest.fn(() => res),
    };
  });

  describe('should call verify-checkout', () => {
    test('returns verify-checkout success', async () => {
      await checkout.verifyCheckout(req, res);

      expect(res.send).toHaveBeenCalledWith(jgSuccessUrl);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    describe('failures', () => {
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

        expect(logger.warn).toHaveBeenCalledWith('CART_VERIFY_ERROR', 'Verify cart found an error', {
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

        expect(logger.warn).toHaveBeenCalledWith('CART_VERIFY_ERROR', 'Verify cart found an error', {
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

        expect(logger.warn).toHaveBeenCalledWith('CART_VERIFY_ERROR', 'Verify cart found an error', {
          errors,
        });
        expect(res.send).toHaveBeenCalledWith({
          errors,
          message: 'Something is wrong with your cart',
        });
        expect(res.status).toHaveBeenCalledWith(400);
      });

      test('price override active', async () => {
        const errors = [
        ];

        await checkout.verifyCheckout(req, res);

        expect(logger.warn).toHaveBeenCalledWith('CART_VERIFY_ERROR', 'Verify cart found an error', {
          errors,
        });
        expect(res.send).toHaveBeenCalledWith({
          errors,
          message: 'Something is wrong with your cart',
        });
        expect(res.status).toHaveBeenCalledWith(400);
      });
    });
  });

  describe('verify-donation', () => {

  });
});

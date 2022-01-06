const stripe = require('stripe')(process.env.STRIPE_KEY);
const { Get } = require('../sql/sqlFunctions');
const safeJsonParse = require('../extraFunctions/safeJsonParse');

const romans = {
  1: 'I',
  2: 'II',
  3: 'III',
  4: 'IV',
  5: 'V',
  6: 'VI',
  7: 'VII',
  8: 'VIII',
  9: 'IX',
  10: 'X',
};

const items = ['armor', 'tool', 'weapon', 'food', 'material'];

const verifyPurchase = async (product) => {
  const {
    id, type, price, power, time,
  } = product;
  if (items.includes(type)) {
    const [key] = await Get('items', id);
    if (key) {
      return price === key.price && !key.disabled;
    }
  }
  if (type === 'mob') {
    const [key] = await Get('mobs', id);
    if (key) {
      return price === key.price && !key.disabled;
    }
  }
  if (type === 'effect') {
    const [key] = await Get('effects', id);
    if (key) {
      return price === key.price && power < 10 && time <= 300 && !key.disabled;
    }
  }
  return false;
};

const verifyPlayer = async (username) => {
  const data = await Get('players', username, 'username');
  if (data.length === 0) {
    return null;
  }
  return data[0].name;
};

module.exports = {
  createCheckout: async (req, res) => {
    try {
      const line = [];
      const commands = [];
      const realName = await verifyPlayer(req.body.username);
      for (let i = 0; i < req.body.cart.length; i += 1) {
        const element = req.body.cart[i];
        // eslint-disable-next-line no-await-in-loop
        const verify = await verifyPurchase(element);
        if (verify) {
          let name = `${req.body.username} [${realName}] | ${element.name}`;
          let cost = element.price * 100;
          let amount;
          let cmd;
          if (element.type === 'effect') {
            name += ` ${romans[element.power + 1]} (${element.time}s)`;
            cost *= (element.time / 30) * (element.power + 1);
            amount = 1;
            cmd = `effect give ${req.body.username} ${element.id} ${element.time} ${element.power + 1}`;
          } else {
            amount = element.amount;
            cmd = `give ${req.body.username} minecraft:${element.id}`;
            if (element.id === 'arrow') {
              cmd += ' 10';
            }
          }
          line.push(
            {
              price_data: {
                currency: 'usd',
                product_data: {
                  name,
                  description: element.description,
                  images: [element.icon],
                },
                unit_amount: cost,
              },
              quantity: amount,
            },
          );
          commands.push(cmd);
        }
      }
      if (line.length === req.body.cart.length && realName != null) {
        const session = await stripe.checkout.sessions.create({
          line_items: line,
          mode: 'payment',
          metadata: {
            commands: JSON.stringify(commands),
          },
          success_url: `https://${process.env.DOMAIN}/?success=true`,
          cancel_url: `https://${process.env.DOMAIN}?canceled=true`,
        });
        res.redirect(303, session.url);
      } else {
        res.status(400).send('Invalid Cart Data');
      }
    } catch (error) {
      const { code = 500, message = error.message } = safeJsonParse(error.message);
      res.status(code).send(`Error: ${message}`);
    }
  },
};

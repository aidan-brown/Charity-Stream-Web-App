const { Player } = require('../sql/models');
const { all } = require('../minecraftData');

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
    const item = all.find((i) => i.id === id);
    if (item) {
      const { price: p, disabled: d } = item;

      return price === p && !d && (type === 'effect' ? power < 10 && time <= 300 : true);
    }
  }
  return false;
};

const verifyPlayer = async (username) => {
  const [{ name }] = await Player.findAll({ where: { username } });

  return name;
};

module.exports = {
  createCheckout: async (req, res) => {
    try {
      const line = [];
      const commands = [];
      const realName = await verifyPlayer(req.body.username);
      for (let i = 0; i < req.body.cart.length; i += 1) {
        const element = req.body.cart[i];
        await verifyPurchase(element).then((verify) => {
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
              commands.push(cmd);
            } else if (element.type === 'mob') {
              amount = element.amount;
              for (let j = 0; j < amount; j += 1) {
                cmd = `execute at ${req.body.username} run summon ${element.id} ~ ~ ~`;
                commands.push(cmd);
              }
            } else {
              amount = element.amount;
              cmd = `give ${req.body.username} ${element.id}`;
              if (element.id === 'arrow') {
                const totalArrows = element.amount * 10;
                cmd += ` ${totalArrows}`;
              } else {
                cmd += ` ${element.amount}`;
              }
              commands.push(cmd);
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
          }
        });
      }
      if (line.length === req.body.cart.length && realName != null) {
        const session = await stripe.checkout.sessions.create({
          line_items: line,
          mode: 'payment',
          success_url: `https://${process.env.DOMAIN}/?success=true`,
          cancel_url: `https://${process.env.DOMAIN}?canceled=true`,
          metadata: commands,
        });
        res.status(200).send(session.url);
      } else {
        res.status(400).send('Invalid Cart Data');
      }
    } catch (error) {
      // const { code = 500, message = error.message } = safeJsonParse(error.message);
      res.status(500).send(`Error: ${error}`);
    }
  },
};

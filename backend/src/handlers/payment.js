const stripe = require('stripe')(process.env.STRIPE_KEY);
const { Get } = require('../sql/sqlFunctions');
const safeJsonParse = require('../extraFunctions/safeJsonParse');

const romans = {
  1 : 'I',
  2 : 'II',
  3 : 'III',
  4 : 'IV',
  5 : 'V',
  6 : 'VI',
  7 : 'VII',
  8 : 'VIII',
  9 : 'IX',
  10 : 'X'
}

const items = ['armor', 'tool', 'weapon', 'food', 'material'];

async function verifyPurchase(product){
  if (items.includes(product.type)){
    let key = await Get('items', product.id).then(token => { return token } );
    if (key.length == 0){
      return false;
    }
    return product.price == key[0]['price']*product.amount; 
  } else if (product.type == 'mob'){
    let key = await Get('mobs', product.id).then(token => { return token } );
    if (key.length == 0){
      return false;
    }
    return product.price == key[0]['price']*product.amount;
  } else if (product.type == 'effect'){
    let key = await Get('effects', product.id).then(token => { return token } );
    if (key.length == 0){
      return false;
    }
    return product.price == key[0]['price'] * (product.power+1) * (product.time/30) && product.power < 10 && product.time <= 300;
  }
  return false;
}

module.exports = {
  createCheckout : async (req, res) => {
    try {
      let line = [];
      for( var i = 0; i < req.body['cart'].length; i++ ){
        element = req.body['cart'][i]
        await verifyPurchase(element).then(verify => {
          console.log(`${element.id} | ${verify}`);
          if ( verify ){
            let name = element.name;
            let cost;
            let amount;
            let cmd;
            if (element.type == "effect"){
              name += ` ${romans[element.power+1]} (${element.time}s)`;
              cost = element.price*100;
              amount = 1;
            } else {
              cost = element.price/element.amount*100;
              amount = element.amount;
            }
            line.push(
              {
                price_data: {
                  currency: 'usd',
                  product_data: {
                    name: name,
                    description: element.description,
                    images: [element.icon],
                  },
                  unit_amount: cost
                },
                quantity: amount,
              }
            )
          }
        });
      }
      if (line.length == req.body['cart'].length){
        const session = await stripe.checkout.sessions.create({
          line_items: line,
          mode: 'payment',
          success_url: `https://${process.env.DOMAIN}/?success=true`,
          cancel_url: `https://${process.env.DOMAIN}?canceled=true`,
        });
        res.redirect(303, session.url);
      } else {
        res.status(400).send("Invalid Cart Data");
      }
    } catch (error) {
      const { code = 500, message = error.message } = safeJsonParse(error.message);
      res.status(code).send('Error: ' + message);
    }
  },
};



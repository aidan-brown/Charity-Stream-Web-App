const stripe = require('stripe')(process.env.STRIPE_KEY);
const Rcon = require('modern-rcon');

const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

const rcon = new Rcon(process.env.MCSERVER, 25569, process.env.MCSERVERPWRD, 5000);

module.exports = {
  hook: async (request, response) => {
    const sig = request.headers['stripe-signature'];

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        rcon.connect().then(async () => {
          for (const key in session.metadata) {
            if (session.metadata[key]) {
              await rcon.send(session.metadata[key]);
            }
          }
        }).then(() => {
          rcon.disconnect();
          response.status(200).send('OK');
        }).catch((error) => {
          console.log(error);
          response.status(500).send(error);
        });
        // Then define and call a function to handle the event checkout.session.completed
        break;
      }
      // ... handle other event types
      default: {
        console.log(`Unhandled event type ${event.type}`);
      }
    }
  },
};

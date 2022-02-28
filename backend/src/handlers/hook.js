const stripe = require('stripe')(process.env.STRIPE_KEY);

const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

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
